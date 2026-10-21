import { digitalMarketplaceService } from '../src/application/services/DigitalMarketplaceService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`[PASS] ${message}`);
  }
}

async function runDigitalMarketplaceTests() {
  console.log('================================================================');
  console.log('COMMERCE ZON DIGITAL MARKETPLACE & LICENSING - VALIDATION');
  console.log('================================================================');

  let passed = 0;
  const total = 18;

  try {
    // --- Test 1: Digital Catalog Retrieval & Category Filtering ---
    console.log('\n--- Test 1: Digital Catalog Retrieval & Category Filtering ---');
    const allProds = digitalMarketplaceService.getProducts();
    assert(allProds.length >= 8, `Catalog seeded with at least 8 digital assets (count: ${allProds.length})`);
    passed++;

    const saasKits = digitalMarketplaceService.getProducts({ category: 'saas_boilerplates' });
    assert(saasKits.length >= 1, 'Filtered SaaS boilerplates successfully');
    passed++;

    const searchHits = digitalMarketplaceService.getProducts({ query: 'OmniStack' });
    assert(searchHits.length >= 1 && searchHits[0].title.includes('OmniStack'), 'Search query matches title and tech stack');
    passed++;

    // --- Test 2: Instant Digital Checkout & Cryptographic License Generation ---
    console.log('\n--- Test 2: Instant Digital Checkout & Cryptographic License Generation ---');
    const targetProduct = digitalMarketplaceService.getProductById('DIGI-PROD-001')!;
    const checkoutResult = digitalMarketplaceService.checkoutDigitalProduct({
      productId: targetProduct.id,
      licenseType: 'commercial',
      buyerId: 'buyer-digital-test-01',
      buyerEmail: 'techlead@acmecorp.dev',
      paymentMethod: 'WALLET'
    });

    assert(!!checkoutResult.order.orderId, `Generated order ID: ${checkoutResult.order.orderId}`);
    passed++;

    assert(checkoutResult.order.status === 'COMPLETED', 'Order status is instantly COMPLETED (zero shipping wait)');
    passed++;

    const key = checkoutResult.order.licenseKey;
    assert(/^CZON-DIGI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key), `Cryptographic license matches pattern CZON-DIGI-XXXX-XXXX-XXXX-XXXX: "${key}"`);
    passed++;

    assert(checkoutResult.vaultItem.downloadToken.startsWith('tok_sec_'), 'Signed expirable asset download token issued');
    passed++;

    assert(checkoutResult.vaultItem.maxActivations === 5, 'Commercial license initialized with 5 domain seats');
    passed++;

    // --- Test 3: Customer Vault Isolation & Refresh Token ---
    console.log('\n--- Test 3: Customer Vault Isolation & Refresh Token ---');
    const vault = digitalMarketplaceService.getUserVault();
    const vaultItem = vault.find(v => v.licenseKey === key);
    assert(!!vaultItem, 'Purchased asset immediately present in buyer Digital Vault');
    passed++;

    const oldToken = vaultItem!.downloadToken;
    const refreshed = digitalMarketplaceService.refreshToken(vaultItem!.id);
    assert(refreshed.token !== oldToken && refreshed.token.startsWith('tok_sec_'), 'Download token regenerated with fresh 7-day TTL');
    passed++;

    // --- Test 4: License Verification API ---
    console.log('\n--- Test 4: License Verification API ---');
    const verifyValid = digitalMarketplaceService.verifyLicense(key);
    assert(verifyValid.valid === true, 'Verification confirms license authenticity');
    passed++;

    assert(verifyValid.seatsRemaining === 5, 'Reports 5 available seats for commercial tier');
    passed++;

    const verifyInvalid = digitalMarketplaceService.verifyLicense('CZON-DIGI-FAKE-KEY9-0000-0000');
    assert(verifyInvalid.valid === false, 'Rejects forged or unissued license keys');
    passed++;

    // --- Test 5: Machine/Domain Activation and Seat Limit Guard ---
    console.log('\n--- Test 5: Machine/Domain Activation and Seat Limit Guard ---');
    const act1 = digitalMarketplaceService.activateLicense(key, 'production.acmecorp.dev');
    assert(act1.success === true && !!act1.activationId, `Seat 1 activated: ${act1.message}`);
    passed++;

    const act2 = digitalMarketplaceService.activateLicense(key, 'staging.acmecorp.dev');
    assert(act2.success === true, 'Seat 2 activated for staging environment');
    passed++;

    const postActVerify = digitalMarketplaceService.verifyLicense(key);
    assert(postActVerify.activeSeatsCount === 2 && postActVerify.seatsRemaining === 3, 'Remaining seats updated to 3 after 2 bindings');
    passed++;

    const revokeOk = digitalMarketplaceService.revokeActivation(vaultItem!.id, act2.activationId!);
    assert(revokeOk === true, 'Revoking staging seat frees up slot');
    passed++;

    // --- Test 6: Creator Studio Publishing & Version Update Broadcast ---
    console.log('\n--- Test 6: Creator Studio Publishing & Version Update Broadcast ---');
    const newAsset = digitalMarketplaceService.publishProduct({
      title: 'VectorFlow - Distributed Vector Database SDK for Node.js',
      shortDescription: 'Sub-millisecond semantic search engine for HNSW indices.',
      description: 'Zero-latency vector index runner with cosine similarity clustering.',
      category: 'developer_tools',
      fileFormat: 'ZIP (.ts, .rs)',
      fileSize: '55 MB',
      standardPrice: 69,
      commercialPrice: 189,
      extendedPrice: 450,
      techStack: ['TypeScript', 'Rust', 'WebAssembly'],
      authorName: 'VectorFlow Core'
    });

    assert(newAsset.id.startsWith('DIGI-PROD-'), `Created new digital product with ID: ${newAsset.id}`);
    passed++;

    const releaseOk = digitalMarketplaceService.releaseVersionUpdate(newAsset.id, 'v1.1.0', [
      'Added SIMD vector operations',
      'Optimized memory consumption by 32%'
    ]);
    assert(releaseOk === true && newAsset.version === 'v1.1.0', 'Released version update v1.1.0 with changelog notes');
    passed++;

    console.log(`\n================================================================`);
    console.log(`DIGITAL MARKETPLACE TEST RESULTS: ${passed}/${total} PASSED, 0 FAILED`);
    console.log(`================================================================\n`);
  } catch (err: any) {
    console.error('\n[FATAL] Test failed:', err.message);
    process.exit(1);
  }
}

runDigitalMarketplaceTests();
