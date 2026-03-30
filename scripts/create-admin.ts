// Script to create admin user in Supabase
// Run with: npx tsx scripts/create-admin.ts

import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please add:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n');

  const adminData = {
    email: 'admin@catersmart.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    role: 'admin',
  };

  try {
    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Insert admin user
    console.log('📝 Inserting admin user into database...');
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: adminData.email,
          password_hash: passwordHash,
          first_name: adminData.firstName,
          last_name: adminData.lastName,
          phone: adminData.phone,
          role: adminData.role,
          email_verified: true,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log('⚠️  Admin user already exists!');
        console.log('\nExisting admin credentials:');
        console.log('  Email:', adminData.email);
        console.log('  Password:', adminData.password);
        return;
      }
      throw error;
    }

    console.log('✅ Admin user created successfully!\n');
    console.log('Admin Details:');
    console.log('  ID:', data.id);
    console.log('  Email:', data.email);
    console.log('  Name:', `${data.first_name} ${data.last_name}`);
    console.log('  Role:', data.role);
    console.log('  Created:', data.created_at);
    console.log('\nLogin Credentials:');
    console.log('  Email:', adminData.email);
    console.log('  Password:', adminData.password);
    console.log('\nLogin URL:');
    console.log('  http://localhost:3001/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('\n✨ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
