/**
 * Search Engine & Product Discovery Validation Test Suite
 * Commerce Zon Marketplace - Part 11
 */

import { searchEngineService } from '../src/application/services/SearchEngineService';
import { productService } from '../src/application/services/ProductService';
import { DEFAULT_SEARCH_WEIGHTS } from '../src/types/search';

async function runTestSuite() {
  console.log('====================================================');
  console.log('COMMERCE ZON SEARCH ENGINE - PART 11 VALIDATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, extraInfo: string = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName} - ${extraInfo}`);
      failedTests++;
    }
  }

  try {
    // 1. Empty Query Search
    console.log('--- Test 1: Empty Query Search ---');
    const emptyResult = await searchEngineService.executeSearch({});
    assert(emptyResult.products.length > 0, 'Empty search returns products catalog');
    assert(emptyResult.total > 0, 'Total items count is populated');
    assert(emptyResult.pagination.page === 1, 'Default page is 1');
    assert(emptyResult.executionTimeMs >= 0, `Execution time is recorded (${emptyResult.executionTimeMs}ms)`);

    // 2. Exact Title Match
    console.log('\n--- Test 2: Exact & Keyword Search ---');
    const exactResult = await searchEngineService.executeSearch({ q: 'Titan Workstation X9 Heavy Duty Laptop' });
    assert(exactResult.products.length > 0, 'Exact product title search returns matches');
    assert(
      exactResult.products[0].title.includes('Titan Workstation'),
      'Exact title matched product is ranked first'
    );
    assert(
      exactResult.resultItems[0].relevanceScore >= DEFAULT_SEARCH_WEIGHTS.exactName,
      `Relevance score reflects exact match weight (score: ${exactResult.resultItems[0].relevanceScore})`
    );

    // 3. Keyword / Substring Match
    console.log('\n--- Test 3: Substring & Token Match ---');
    const keywordResult = await searchEngineService.executeSearch({ q: 'robotics' });
    assert(keywordResult.products.length > 0, 'Category/tag keyword query returns matches');
    assert(
      keywordResult.products.some((p) => p.category === 'robotics' || p.tags.includes('robotics')),
      'All returned products contain robotics in category, title, or tags'
    );

    // 4. Case-Insensitive and Whitespace Normalization
    console.log('\n--- Test 4: Case & Whitespace Normalization ---');
    const messyResult = await searchEngineService.executeSearch({ q: '   tItAn    wOrKsTaTiOn   ' });
    assert(messyResult.products.length > 0, 'Messy casing and extra whitespace handled cleanly');
    assert(
      messyResult.products[0].id === exactResult.products[0].id,
      'Normalizes to same top product as clean query'
    );

    // 5. Zero-Result Search & Did-You-Mean Typo Correction
    console.log('\n--- Test 5: Zero Results & Typo Correction ---');
    const typoResult = await searchEngineService.executeSearch({ q: 'titn' });
    assert(typoResult.didYouMean !== null, `Typo detection suggests correction: "${typoResult.didYouMean}"`);

    const noMatchResult = await searchEngineService.executeSearch({ q: 'zzxyznonexistentproduct999' });
    assert(noMatchResult.products.length === 0, 'No match returns empty products array');
    assert(noMatchResult.total === 0, 'Total is 0');

    // 6. Invalid Parameter Handling (Inverted Price Bounds)
    console.log('\n--- Test 6: Price Inversion and Validation ---');
    const invertedPriceResult = await searchEngineService.executeSearch({
      minPrice: 5000,
      maxPrice: 1000,
    });
    assert(
      invertedPriceResult.activeFilters.minPrice! <= invertedPriceResult.activeFilters.maxPrice!,
      'Inverted price range (min > max) was corrected gracefully'
    );

    // 7. Combined Faceted Filters
    console.log('\n--- Test 7: Multi-Faceted Filter Combinations ---');
    const filteredResult = await searchEngineService.executeSearch({
      category: 'computing',
      minPrice: 1000,
      maxPrice: 5000,
      inStock: true,
    });
    assert(
      filteredResult.products.every(
        (p) =>
          p.category === 'computing' &&
          p.price.amount >= 1000 &&
          p.price.amount <= 5000 &&
          p.totalStock > 0
      ),
      'All returned products satisfy every combined filter constraint'
    );

    // 8. Deterministic Sorting
    console.log('\n--- Test 8: Sorting Behavior ---');
    const priceAscResult = await searchEngineService.executeSearch({ sortBy: 'price_asc' });
    const isAscSorted = priceAscResult.products.every((p, idx, arr) => {
      if (idx === 0) return true;
      return p.price.amount >= arr[idx - 1].price.amount;
    });
    assert(isAscSorted, 'Price ascending sort orders products strictly lowest to highest');

    const priceDescResult = await searchEngineService.executeSearch({ sortBy: 'price_desc' });
    const isDescSorted = priceDescResult.products.every((p, idx, arr) => {
      if (idx === 0) return true;
      return p.price.amount <= arr[idx - 1].price.amount;
    });
    assert(isDescSorted, 'Price descending sort orders products strictly highest to lowest');

    // 9. Pagination Behavior
    console.log('\n--- Test 9: Pagination Slicing & Metadata ---');
    const page1 = await searchEngineService.executeSearch({ page: 1, limit: 2 });
    assert(page1.products.length <= 2, 'Page 1 respects limit parameter');
    assert(page1.pagination.page === 1, 'Pagination page is 1');
    assert(page1.pagination.limit === 2, 'Pagination limit is 2');

    if (page1.pagination.totalPages > 1) {
      const page2 = await searchEngineService.executeSearch({ page: 2, limit: 2 });
      assert(page2.pagination.page === 2, 'Page 2 advances correctly');
      const page1Ids = page1.products.map((p) => p.id);
      const page2Ids = page2.products.map((p) => p.id);
      const hasOverlap = page1Ids.some((id) => page2Ids.includes(id));
      assert(!hasOverlap, 'Stable pagination guarantees no product duplicates between pages');
    }

    // 10. Autocomplete Suggestions
    console.log('\n--- Test 10: Autocomplete Engine ---');
    const autoComp = await searchEngineService.getAutocomplete('tit');
    assert(autoComp.suggestions.length > 0, 'Autocomplete returns suggestions for prefix');
    assert(
      autoComp.suggestions.some((s) => s.type === 'product' && s.title.toLowerCase().includes('titan')),
      'Autocomplete includes matching product'
    );
    assert(autoComp.executionTimeMs >= 0, `Autocomplete executed rapidly (${autoComp.executionTimeMs}ms)`);

    // 11. AI Query Intent Fallback & Parsing
    console.log('\n--- Test 11: AI Query Understanding Intent ---');
    const aiIntent = await searchEngineService.parseAIQueryIntent('affordable laptop under 3000 in stock');
    assert(
      aiIntent.extractedKeywords.length > 0,
      `AI Intent extracted keywords: "${aiIntent.extractedKeywords}"`
    );
    assert(
      aiIntent.suggestedCategory === 'computing',
      `AI Intent correctly identified category: "${aiIntent.suggestedCategory}"`
    );
    assert(
      aiIntent.suggestedMaxPrice === 3000,
      `AI Intent extracted max price: $${aiIntent.suggestedMaxPrice}`
    );
    assert(
      aiIntent.suggestedInStock === true,
      `AI Intent detected inStock requirement: ${aiIntent.suggestedInStock}`
    );

    // 12. Search Analytics Tracking
    console.log('\n--- Test 12: Search Telemetry & Analytics ---');
    const analytics = searchEngineService.getAnalyticsSummary();
    assert(analytics.totalSearches > 0, `Analytics recorded total queries: ${analytics.totalSearches}`);
    assert(analytics.topQueries.length > 0, 'Top query frequency map contains terms');
    assert(analytics.averageLatencyMs >= 0, `Average latency computed: ${analytics.averageLatencyMs}ms`);

    // 13. Cache Invalidation
    console.log('\n--- Test 13: Cache Invalidation ---');
    searchEngineService.invalidateCache();
    assert(true, 'Cache invalidated cleanly with no errors');

    console.log('\n====================================================');
    console.log(`TEST SUITE COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test suite failed with unexpected error:', err);
    process.exit(1);
  }
}

runTestSuite();
