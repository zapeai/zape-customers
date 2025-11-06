# 📧 Email Confirmation Setup Guide

## Problem: "Email not confirmed" Error

This error occurs when Supabase requires users to confirm their email before logging in. The app now handles this properly, but you have two options:

---

## ✅ Option 1: Disable Email Confirmation (Recommended for Development)

**Best for:** Local development and testing

### Steps:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/providers

2. **Navigate to Email Auth Settings:**
   - Click on **"Email"** provider in the list
   - Scroll down to **"Email Confirmation"**

3. **Disable Email Confirmation:**
   - **Uncheck** the box that says "Enable email confirmations"
   - Click **"Save"**

4. **Test immediately:**
   - Users can now sign up and login immediately without email confirmation
   - Perfect for development!

### Pros:
- ✅ Instant signup and login
- ✅ No need to check emails during testing
- ✅ Faster development workflow

### Cons:
- ⚠️ Not recommended for production (security risk)
- ⚠️ Users won't verify their email addresses

---

## 🔐 Option 2: Keep Email Confirmation Enabled (Production Ready)

**Best for:** Production environment

The app now handles email confirmation properly:

### How it works:

1. **User Signs Up:**
   - User fills out the signup form
   - Account is created
   - User sees message: "Conta criada! Verifique seu email para confirmar o cadastro"

2. **User Checks Email:**
   - Supabase sends confirmation email
   - User clicks confirmation link
   - Account is activated

3. **User Logs In:**
   - User returns to your app
   - Enters credentials
   - Successfully logs in

### Better Error Messages:

The app now shows friendly Portuguese error messages:
- ✅ "Email não confirmado. Verifique sua caixa de entrada..."
- ✅ Success message after signup
- ✅ Clear instructions for users

### Setup Email Templates (Optional):

You can customize the confirmation email:

1. Go to: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/templates
2. Edit the "Confirm signup" template
3. Customize the message and styling

---

## 🛠️ For Testing with Email Confirmation

If you want to test with email confirmation enabled:

### 1. Use a Real Email Service

Make sure Supabase is configured with SMTP settings:
- Go to: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/settings/auth
- Configure SMTP (optional, uses Supabase's default if not set)

### 2. Check Spam Folder

Confirmation emails might end up in spam.

### 3. Use Test Email Services

For development, you can use:
- [Mailtrap.io](https://mailtrap.io) - Catch test emails
- [Mailgun](https://mailgun.com) - Free tier for testing
- Your own Gmail with "App Password"

### 4. Manually Confirm Users

You can manually confirm users in Supabase:

1. Go to: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/users
2. Find the user
3. Click on them
4. Click "Confirm email"

---

## 🎯 Recommended Setup

### For Development:
```
✅ Disable email confirmation
✅ Fast testing
✅ No email setup needed
```

### For Production:
```
✅ Enable email confirmation
✅ Verify email addresses
✅ Customize email templates
✅ Use custom SMTP (optional)
```

---

## 📝 Current App Features

The authentication page now includes:

✅ **Better Error Handling:**
- Shows friendly messages in Portuguese
- Explains what to do when email is not confirmed

✅ **Success Messages:**
- Notifies user after successful signup
- Tells them to check their email

✅ **Auto Profile Creation:**
- Creates profile automatically on first login
- Handles missing profiles gracefully

✅ **Email Redirect:**
- Users are redirected to `/courts` after email confirmation

---

## 🐛 Troubleshooting

### Issue: Not receiving confirmation emails

**Solutions:**
1. Check spam/junk folder
2. Verify email address is correct
3. Disable email confirmation (for dev)
4. Manually confirm in dashboard

### Issue: "Email not confirmed" after clicking link

**Solutions:**
1. Make sure the link hasn't expired (1 hour default)
2. Try signing up again
3. Manually confirm user in dashboard

### Issue: Confirmation link doesn't work

**Solutions:**
1. Check the redirect URL in auth settings
2. Make sure your app is running on the correct URL
3. Update `emailRedirectTo` in the code if needed

---

## 🔗 Useful Links

- [Auth Settings](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/settings/auth)
- [Email Templates](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/templates)
- [Email Provider Settings](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/providers)
- [User Management](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/users)

---

## ✨ Summary

**To fix the "Email not confirmed" error right now:**

1. Go to [Email Provider Settings](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/providers)
2. Click "Email"
3. Uncheck "Enable email confirmations"
4. Click "Save"
5. Try signing up again! 🎉

The app is now ready to handle both scenarios (with or without email confirmation).

