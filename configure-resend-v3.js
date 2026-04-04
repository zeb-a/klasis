const POCKETBASE_ADMIN_EMAIL = 'admin@klasiz.fun';
const POCKETBASE_ADMIN_PASSWORD = 'password123';
const POCKETBASE_URL = 'https://klasiz.fun';

const EMAIL_VERIFICATION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email - Klasiz</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; padding:50px 40px; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://klasiz.fun/Klasiz-PWA-logo.svg" alt="Klasiz Logo" width="180" style="display:block; max-width:180px; height:auto;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; font-size:28px; font-weight:700; color:#111827; letter-spacing:-0.5px;">Verify Your Email</h1>
              <p style="margin:12px 0 0 0; font-size:16px; color:#6b7280; font-weight:400;">Welcome to Klasiz! 🎉</p>
            </td>
          </tr>
          <tr>
            <td style="color:#374151; font-size:16px; line-height:1.7; padding-bottom:30px;">
              <p style="margin:0 0 16px 0;">Hello,</p>
              <p style="margin:0 0 20px 0;">Thank you for signing up for <strong style="color:#111827;">Klasiz</strong>! To get started, please verify your email address by clicking the button below.</p>
              <p style="margin:0 0 24px 0; color:#6b7280; font-size:15px;">⏰ This verification link will expire in 24 hours for your security.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 0 30px 0;">
              <a href="{{.url}}" target="_blank" rel="noopener" style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#ffffff; text-decoration:none; font-size:16px; font-weight:600; border-radius:12px; box-shadow:0 4px 14px rgba(102, 126, 234, 0.4); transition:all 0.2s ease;">✓ Verify My Email</a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #f1f5f9; padding-top:30px;">
              <p style="margin:0 0 12px 0; font-size:13px; color:#94a3b8; font-weight:500;">Button not working? Copy and paste this link:</p>
              <p style="word-break:break-all; margin:0 0 20px 0;">
                <a href="{{.url}}" target="_blank" rel="noopener" style="color:#667eea; font-size:13px; text-decoration:none; font-weight:500;">{{.url}}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #f1f5f9; padding-top:30px; color:#64748b; font-size:14px; line-height:1.6;">
              <p style="margin:0 0 10px 0; font-weight:500;">🔒 Security Notice</p>
              <p style="margin:0 0 16px 0;">If you did not create an account with Klasiz, you can safely ignore this email. Your information won't be shared with anyone.</p>
              <p style="margin:0;">For your security, never share this verification link with anyone.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:40px; border-top:1px solid #f1f5f9;">
              <p style="margin:0 0 12px 0; font-size:14px; color:#94a3b8; font-weight:500;">Need help? Contact us at <a href="mailto:support@klasiz.fun" style="color:#667eea; text-decoration:none;">support@klasiz.fun</a></p>
              <p style="margin:0; font-size:13px; color:#cbd5e1;">© 2026 Klasiz — All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

async function configureResendSMTP() {
  try {
    console.log(`🔌 Connecting to PocketBase at ${POCKETBASE_URL}...`);

    // Login as admin
    const loginResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: POCKETBASE_ADMIN_EMAIL,
        password: POCKETBASE_ADMIN_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const authData = await loginResponse.json();
    const token = authData.token;
    console.log('✅ Admin login successful');

    // Get all settings using settings API
    const settingsResponse = await fetch(`${POCKETBASE_URL}/api/settings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!settingsResponse.ok) {
      throw new Error(`Failed to get settings: ${settingsResponse.status}`);
    }

    const settings = await settingsResponse.json();
    console.log('📧 Got current settings');

    // Configure SMTP settings
    settings.smtp = {
      enabled: true,
      host: 'smtp.resend.com',
      port: 587,
      username: 'resend',
      fromEmail: 'noreply@klasiz.fun',
      fromName: 'Klasiz',
      tls: true
    };

    // Configure email templates
    settings.emailTemplates = settings.emailTemplates || {};
    settings.emailTemplates.verificationEmail = {
      subject: 'Verify Your Email Address',
      body: EMAIL_VERIFICATION_TEMPLATE
    };

    // Update settings
    const updateResponse = await fetch(`${POCKETBASE_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update settings: ${updateResponse.status} ${errorText}`);
    }

    console.log('✅ Resend SMTP configured successfully!');
    console.log('\n📧 SMTP Configuration:');
    console.log('   Host: smtp.resend.com');
    console.log('   Port: 587');
    console.log('   Username: resend');
    console.log('   From Email: noreply@klasiz.fun');
    console.log('   From Name: Klasiz');
    console.log('\n⚠️  FINAL STEPS:');
    console.log('   1. Get your Resend API key from https://resend.com/api-keys');
    console.log('   2. Go to https://klasiz.fun/_/');
    console.log(`   3. Login with ${POCKETBASE_ADMIN_EMAIL}`);
    console.log('   4. Navigate to Settings > Email');
    console.log('   5. Enter your Resend API key in "SMTP Password" field');
    console.log('   6. Verify noreply@klasiz.fun in your Resend dashboard');
    console.log('\n✨ After setting the API key, email verification will be enabled!');

  } catch (error) {
    console.error('❌ Configuration failed:', error.message);
    process.exit(1);
  }
}

configureResendSMTP();
