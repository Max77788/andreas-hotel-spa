
const {createClient} = require('@supabase/supabase-js');
const url = 'https://phgogybfgovrlcdmifpv.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ29neWJmZ292cmxjZG1pZnB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE0OTQ2MiwiZXhwIjoyMDkwNzI1NDYyfQ.SkCAD-o8b8k_FsBlHRNaLQkv9GcBYqCIZBzFAxnYYP0';

async function test() {
    // Test 1: db.schema - fetch data
    const c1 = createClient(url, key, {db: {schema: 'andreas_website'}});
    const r1 = await c1.from('policies').select('*');
    console.log('Test 1 (db.schema): data=' + JSON.stringify(r1.data?.length || 0) + ' rows, error=' + (r1.error?.message || 'none'));
    if (r1.data?.length) console.log('  sample:', JSON.stringify(r1.data[0]));
    
    // Test 2: .schema() method
    const c2 = createClient(url, key);
    const r2 = await c2.schema('andreas_website').from('policies').select('*');
    console.log('Test 2 (.schema()): data=' + JSON.stringify(r2.data?.length || 0) + ' rows, error=' + (r2.error?.message || 'none'));
    if (r2.data?.length) console.log('  sample:', JSON.stringify(r2.data[0]));
    
    // Test 3: no schema  
    const c3 = createClient(url, key);
    const r3 = await c3.from('policies').select('*');
    console.log('Test 3 (no schema): data=' + JSON.stringify(r3.data?.length || 0) + ' rows, error=' + (r3.error?.message || 'none'));
    
    // Test 4: anon key with db.schema
    const c4 = createClient(url, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ29neWJmZ292cmxjZG1pZnB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE0OTQ2MiwiZXhwIjoyMDkwNzI1NDYyfQ.SkCAD-o8b8k_FsBlHRNaLQkv9GcBYqCIZBzFAxnYYP0', {db: {schema: 'andreas_website'}});
    const r4 = await c4.from('policies').select('*');
    console.log('Test 4 (anon + db.schema): data=' + JSON.stringify(r4.data?.length || 0) + ' rows, error=' + (r4.error?.message || 'none'));
}

test().catch(e => console.error('Error:', e.message));
