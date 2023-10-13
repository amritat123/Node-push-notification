const nodemailer = require("nodemailer");
const { sendEmailNotification } = require("../controller/email-notification");

// async function SendMail() {
// type = 3  for send email whose status is 0
exports.SendMail = async (to, subject, message, type, language) => {
  try {
    let messageBody = await getEmailBodyRegistrationOtp(message, language);
    if (type == 2) {
      messageBody = await getEmailBodyResetPasswordOtp(message, language);
    } else if (type == 3) {
      messageBody = await sendEmailNotifications(message, language);
    }
    let transporter = nodemailer.createTransport({
      host: "sitename.is",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "", // generated ethereal user
        pass: "", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: "no-reply@sitename.is", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: messageBody, // html body
    });
    return info;
  } catch (err) {
    console.log(err);
    return err;
  }
};

function sendEmailNotifications(message) {
  let url = process.env.URL + "uploads/logo.png";
  let emailBody = ``;
  emailBody = `<tbody>
      <tr>
         <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
               <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                     <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Message from sitename </div>
                     </td>
                  </tr>
                  <tr>
                     <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                        <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">${message}</div>
                     </td>
                  </tr>
               </table>
               
            </div>
         </td>
      </tr>
   </tbody>`;
  return emailBody;
}

function getEmailBodyRegistrationOtp(otp, language) {
  let url = process.env.URL + "uploads/logo.png";
  let site_url = process.env.SITE_URL + "user/verify/" + otp;
  let emailBody = ``;
  if (language == "en") {
    emailBody = `<tbody>
	<tr>
		<td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
					<tr>
						<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
							<div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Verify Email </div>
						</td>
					</tr>
					<tr>
						<td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
							<div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We\'re happy to have you onboard in sitename.</div>
						</td>
					</tr>
				</table>
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
					<tr>
						<td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
							<div style="font-size:16px;font-weight:bold;line-height:24px;text-align:left;color:#000;">Verify Email</div>
						</td>
					</tr>
					<tr>
						<td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
							<div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
								Your Email Verification One-time Password
								<p> ${otp}</p>
								<br /><br /> If you get any kind of problem while using siteName app then feel free to contact us on <a href="mailto:support@sitename.com" title="sitename Support">support@sitename.com</a>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</td>

	</tr>
	<tr>
		<td style="font-size:0px;padding:10px 25px;word-break:break-word;">
			<p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
		</td>
	</tr>
</tbody>`;
  } else {
    emailBody = `<tbody>
	<td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
		<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
			<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
				<tr>
					<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
						<div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> staðfesta tölvupóst </div>
					</td>
				</tr>
				<tr>
					<td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
						<div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Takk fyrir að skrá þig hjá sitename.</div>
					</td>
				</tr>
			</table>
			<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
				<tr>
					<td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
						<div style="font-size:16px;font-weight:bold;line-height:24px;text-align:left;color:#000;">staðfesta tölvupóst</div>
					</td>
				</tr>
				<tr>
					<td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
						<div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
							Staðfestingarkóði þinn er:
							<p> ${otp}</p>
							<br /><br /> Ef þú lendir í vandræðum getur þú alltaf haft samband við okkur í netfangið info@sitename.is <a href="mailto:support@sitename.com" title="sitename Support">support@sitename.com</a>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</td>
	<tr>
		<td style="font-size:0px;padding:10px 25px;word-break:break-word;">
			<p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
		</td>
	</tr>
</tbody>`;
  }
  return emailBody;
}

function getEmailBodyResetPasswordOtp(otp, language) {
  let url = process.env.URL + "uploads/logo.png";
  let site_url = process.env.SITE_URL + "reset-password/" + otp;
  let emailBody = ``;
  if (language == "en") {
    emailBody = `<tbody>
      <tr>
         <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
               <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                     <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Reset Password </div>
                     </td>
                  </tr>
                  <tr>
                     <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                        <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">We received a request to reset your password.</div>
                     </td>
                  </tr>
                  <tr>
                     <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                        <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Your OTP to reset the password for this session is </div>
                     </td>
                  </tr>
               </table>
               <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
   
                  <tr>
                     <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                        <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                           <p style="font-size: 22px; color: #000000"> ${otp}</p>
                           <br /><br /> If you get any kind of problem while using sitename app then feel free to contact us on <a href="mailto:info@sitename.com" title="sitename Support">info@sitename.com</a>
                        </div>
                     </td>
                  </tr>
               </table>
            </div>
         </td>
      </tr>
      <tr>
         <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
         </td>
      </tr>
   </tbody>`;
  } else {
    emailBody = `<tbody>
    <tr>
       <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                <tr>
                   <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#323232;"> Endurstilla lykilorð </div>
                   </td>
                </tr>
                <tr>
                   <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                      <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">Við höfum fengið beiðni um nýtt lykilorð. Nýr kóði er:</div>
                   </td>
                </tr>
                <tr>
                   <td align="left" style="font-size:0px;padding:10px 25px 0px 25px;word-break:break-word;">
                      <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">OTP þinn til að endurstilla lykilorðið fyrir þessa lotu er </div>
                   </td>
                </tr>
             </table>
             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top; margin:30px 0px;" width="100%">
 
                <tr>
                   <td align="left" style="font-size:0px;padding:0 25px;word-break:break-word;">
                      <div style="font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                         <p style="font-size: 22px; color: #000000"> ${otp}</p>
                         <br /><br /> Ekki hika við að hafa samband við okkur á netfangið <a href="mailto:hello@sitename.is" title="sitename Support">hello@sitename.is</a>
                      </div>
                   </td>
                </tr>
             </table>
          </div>
       </td>
    </tr>
    <tr>
       <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <p style="border-top:solid 1px #DFE3E8;font-size:1;margin:0px auto;width:100%;"></p>
       </td>
    </tr>
 </tbody>`;
  }
  return emailBody;
}
