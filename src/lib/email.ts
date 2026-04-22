import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || '51易经 <noreply@51yijing.cn>'
const SITE_URL = process.env.NEXTAUTH_URL || 'https://51yijing.com'

export async function sendVerificationEmail({
  to,
  verifyToken,
  school,
}: {
  to: string
  verifyToken: string
  school: string
}) {
  const verifyUrl = `${SITE_URL}/api/daily/verify?token=${verifyToken}`
  const schoolName = school === 'yijing' ? '易经' : school === 'daoist' ? '道家' : '全部'

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `确认订阅「每日古典智慧 · ${schoolName}」`,
    html: getVerificationEmailHtml({ verifyUrl, schoolName }),
  })

  if (error) {
    console.error('[email] Failed to send verification:', error)
    throw new Error(`Email send failed: ${(error as { message?: string }).message ?? String(error)}`)
  }

  return data
}

function getVerificationEmailHtml({
  verifyUrl,
  schoolName,
}: {
  verifyUrl: string
  schoolName: string
}): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#e8e0d0;font-family:'Songti SC','SimSun',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e0d0;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#f5f0e8;border:1px solid #c8b89a;border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#2c1810;padding:28px 32px;text-align:center;">
            <div style="font-size:28px;color:#b8860b;letter-spacing:4px;">☯</div>
            <div style="font-size:18px;color:#f5f0e8;letter-spacing:6px;margin-top:8px;">51易经</div>
            <div style="font-size:11px;color:#b8860b;letter-spacing:3px;margin-top:4px;">每日古典智慧</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#3d2b1f;line-height:1.8;">您好，</p>
            <p style="margin:0 0 24px;font-size:15px;color:#3d2b1f;line-height:1.8;">
              感谢您订阅「每日古典智慧 · <strong style="color:#b8860b;">${schoolName}</strong>」。<br>
              每日一则，汲取千年智慧，涵养心性。
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#3d2b1f;line-height:1.8;">
              请点击下方按钮确认您的订阅：
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:#b8860b;border-radius:3px;">
                  <a href="${verifyUrl}"
                     style="display:inline-block;padding:14px 40px;font-size:15px;color:#f5f0e8;text-decoration:none;letter-spacing:3px;font-family:'Songti SC','SimSun',serif;">
                    确认订阅
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#8b7355;line-height:1.6;word-break:break-all;">
              若按钮无法点击，请复制以下链接到浏览器：<br>
              <span style="color:#b8860b;">${verifyUrl}</span>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #c8b89a;margin:0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#8b7355;line-height:1.8;">
              如果这不是您的操作，请忽略此邮件。<br>
              © 51易经 · 传承古典智慧
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
