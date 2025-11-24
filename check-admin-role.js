// ============================================
// ADMIN ROLE CHECKER
// Copy and paste this into your browser console (F12)
// ============================================

console.log('==================================================');
console.log('🔍 CHECKING CURRENT USER ROLE');
console.log('==================================================\n');

try {
  const authStorage = localStorage.getItem('auth-storage');
  
  if (!authStorage) {
    console.error('❌ No authentication data found');
    console.log('\n📝 You need to login first!');
  } else {
    const parsed = JSON.parse(authStorage);
    const user = parsed.state?.user;
    const token = parsed.state?.token;
    
    if (!user) {
      console.error('❌ No user data found in storage');
    } else {
      console.log('👤 USER INFORMATION:');
      console.log('  Name:', `${user.firstName} ${user.lastName}`);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Institution:', user.institution?.name || 'None');
      console.log('  Active:', user.isActive);
      
      console.log('\n🔑 AUTHENTICATION:');
      console.log('  Has Token:', token ? '✅ Yes' : '❌ No');
      if (token) {
        console.log('  Token Preview:', `${token.substring(0, 30)}...`);
      }
      
      console.log('\n✅ ADMIN ACCESS CHECK:');
      if (user.role === 'super_admin' || user.role === 'admin') {
        console.log('  ✅ You HAVE admin access!');
        console.log('  Your role:', user.role.toUpperCase());
        console.log('  \n🎉 The Admin Dashboard should work for you!');
      } else {
        console.log('  ❌ You DO NOT have admin access');
        console.log('  Your current role:', user.role);
        console.log('  \n⚠️  You need one of these roles:');
        console.log('     - admin');
        console.log('     - super_admin');
        console.log('  \n📋 Solutions:');
        console.log('     1. Create a SUPER_ADMIN user (see ADMIN_403_FIX.md)');
        console.log('     2. Ask an admin to upgrade your account');
        console.log('     3. Update your role directly in the database');
      }
    }
  }
} catch (error) {
  console.error('❌ Error checking auth data:', error);
}

console.log('\n==================================================');
