import smtplib
import urllib.request
import urllib.error
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import os

class MailService:
    @staticmethod
    def send_reset_code(to_email: str, code: str, user_name: str = "User") -> bool:
        # 1. Try sending via EmailJS REST API if configured
        service_id = os.getenv("EMAILJS_SERVICE_ID")
        template_id = os.getenv("EMAILJS_TEMPLATE_ID")
        public_key = os.getenv("EMAILJS_PUBLIC_KEY")
        private_key = os.getenv("EMAILJS_PRIVATE_KEY") # optional/accessToken

        # Clean/strip variables
        if service_id: service_id = service_id.strip()
        if template_id: template_id = template_id.strip()
        if public_key: public_key = public_key.strip()
        if private_key: private_key = private_key.strip()

        # If EmailJS is configured (checking that we don't have placeholder text)
        if service_id and template_id and public_key and "your_" not in service_id and "your_" not in template_id and "your_" not in public_key:
            url = "https://api.emailjs.com/api/v1.0/email/send"
            payload = {
                "service_id": service_id,
                "template_id": template_id,
                "user_id": public_key,
                "template_params": {
                    "to_name": user_name,
                    "to_email": to_email,
                    "code": code
                }
            }
            if private_key and "your_" not in private_key:
                payload["accessToken"] = private_key
                
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                },
                method="POST"
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    res_body = response.read().decode("utf-8")
                print(f"Successfully sent password reset code via EmailJS to {to_email}")
                return True
            except urllib.error.HTTPError as e:
                error_body = e.read().decode("utf-8")
                print(f"Error sending EmailJS mail to {to_email} (HTTP {e.code}): {error_body}")
            except Exception as e:
                print(f"Error sending EmailJS mail to {to_email}: {e}")
                # Fall back to SMTP if EmailJS fails

        # 2. Try sending via Standard SMTP if configured
        host = os.getenv("SMTP_HOST")
        port = os.getenv("SMTP_PORT")
        user = os.getenv("SMTP_USER")
        password = os.getenv("SMTP_PASSWORD")
        from_email = os.getenv("SMTP_FROM", user)

        if all([host, port, user, password]) and "your-gmail-address" not in user and "ethereal" not in host:
            try:
                msg = MIMEMultipart()
                msg['From'] = from_email
                msg['To'] = to_email
                msg['Subject'] = f"{code} is your PrepBoat AI password reset code"

                body = f"""Hi {user_name},

A password reset was requested for your {to_email} account.

Your password reset verification code is:
{code}

This code is valid for 15 minutes. Enter this code on the verification screen to set a new password.

If you did not make this request, you can safely ignore this email.

Best regards,
PrepBoat AI Placement Team
"""
                msg.attach(MIMEText(body, 'plain'))

                # Start TLS Connection
                server = smtplib.SMTP(host, int(port))
                server.starttls()
                server.login(user, password)
                server.sendmail(from_email, to_email, msg.as_string())
                server.quit()
                
                print(f"Successfully sent password reset code via SMTP to {to_email}")
                return True
            except Exception as e:
                print(f"Error sending SMTP email to {to_email}: {e}")

        # 3. Fallback warning if nothing is configured
        print(f"\n[DEVELOPER WARNING] Neither EmailJS nor SMTP is configured in .env.")
        print(f"Verification code generated for {to_email}:")
        print(f"==> {code}\n")
        return False

