import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'moamalaty_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

const BCRYPT_ROUNDS = 10;

const testUsers = [
  {
    email: 'admin@moamalaty.iq',
    password: 'Admin123!',
    full_name: 'مدير النظام',
    phone: '07701234567',
    role: 'admin',
    id_number: 'A123456789',
    province: 'بغداد',
  },
  {
    email: 'supervisor@gov.iq',
    password: 'Test123!',
    full_name: 'المشرف العام',
    phone: '07701234568',
    role: 'supervisor',
    id_number: 'S123456789',
    province: 'بغداد',
  },
  {
    email: 'employee@gov.iq',
    password: 'Test123!',
    full_name: 'موظف حكومي',
    phone: '07701234569',
    role: 'government_employee',
    id_number: 'E123456789',
    province: 'بغداد',
  },
  {
    email: 'lawyer@moamalaty.iq',
    password: 'Test123!',
    full_name: 'مستشار قانوني',
    phone: '07701234570',
    role: 'legal_advisor',
    id_number: 'L123456789',
    province: 'بغداد',
  },
  {
    email: 'citizen@test.com',
    password: 'Test123!',
    full_name: 'أحمد محمد علي',
    phone: '07701234571',
    role: 'citizen',
    id_number: 'C123456789',
    province: 'بغداد',
    city: 'الكرخ',
    address: 'شارع الكندي، حي المنصور',
  },
];

async function createTestUsers() {
  console.log('🚀 بدء إنشاء المستخدمين التجريبيين...\n');

  try {
    for (const user of testUsers) {
      // Check if user exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existing.rows.length > 0) {
        console.log(`⚠️  المستخدم ${user.email} موجود مسبقاً`);
        continue;
      }

      // Hash password
      const password_hash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

      // Insert user
      await pool.query(
        `INSERT INTO users (email, password_hash, full_name, phone, role, id_number, province, city, address, is_active, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true)`,
        [
          user.email,
          password_hash,
          user.full_name,
          user.phone,
          user.role,
          user.id_number,
          user.province,
          user.city || null,
          user.address || null,
        ]
      );

      console.log(`✅ تم إنشاء: ${user.full_name} (${user.email})`);
    }

    console.log('\n✅ تم إنشاء جميع المستخدمين التجريبيين بنجاح!\n');
    console.log('📋 حسابات التجربة:');
    console.log('═══════════════════════════════════════════════');
    testUsers.forEach(user => {
      console.log(`${user.full_name.padEnd(20)} | ${user.email.padEnd(25)} | ${user.password}`);
    });
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await pool.end();
  }
}

createTestUsers();
