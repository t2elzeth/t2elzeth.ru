from templated_mail.mail import BaseEmailMessage


class ARIsRenderedNotificationEmail(BaseEmailMessage):
    template_name = "email/ar_rendered_out.html"
