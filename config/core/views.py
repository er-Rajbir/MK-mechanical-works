
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from products.models import Machine

from .forms import ContactForm
from products.models import Contact





def home(request):
    machines = Machine.objects.all()

    if not machines.exists():
        machines = Machine.objects.none()

    return render(
        request,
        "core/home.html",
        {
            "machines": machines[:6]
        }
    )
def about(request):
    return render(request, "core/about.html")


def products(request):
    machines = Machine.objects.all()
    return render(
        request,
        "core/products.html",
        {"machines": machines}
    )


def contact(request):

    if request.method == "POST":

        form = ContactForm(request.POST)

        if form.is_valid():

            inquiry = form.save()

            # ==========================
            # Email to Website Owner
            # ==========================

            send_mail(
                subject=f"New Inquiry from {inquiry.full_name}",

                message=f"""
New Contact Inquiry

Name: {inquiry.full_name}
Company: {inquiry.company_name}
Phone: {inquiry.phone}
Email: {inquiry.email}

Machine:
{inquiry.machine}

Message:
{inquiry.message}
""",

                from_email=settings.DEFAULT_FROM_EMAIL,

                recipient_list=[
                    "mandeepsingh88406@gmail.com"
                ],

                fail_silently=False,
            )

            # ==========================
            # Confirmation Email to Customer
            # ==========================

            send_mail(
                subject="Thank You for Contacting MK Industries",

                message=f"""
Dear {inquiry.full_name},

Greetings from MK Industries!

Thank you for contacting us.

We have successfully received your inquiry regarding our industrial machinery.

Our technical team will carefully review your requirements and contact you as soon as possible.

--------------------------------------------------

YOUR SUBMITTED DETAILS

Name : {inquiry.full_name}

Company : {inquiry.company_name}

Email : {inquiry.email}

Phone : {inquiry.phone}

Machine : {inquiry.machine}

--------------------------------------------------

Why Choose MK Industries?

✔ Premium Quality Machines
✔ Reliable Technical Support
✔ Competitive Pricing
✔ Timely Delivery
✔ Customized Manufacturing Solutions

If you have any urgent questions, feel free to reply to this email or call us directly.

Thank you for choosing MK Industries.

Best Regards,

MK Industries
Industrial Machinery Manufacturer

Email : info@mkindustries.com
Phone : +91 XXXXX XXXXX
Website : www.mkindustries.com
""",

                from_email=settings.DEFAULT_FROM_EMAIL,

                recipient_list=[
                    inquiry.email
                ],

                fail_silently=False,
            )

            messages.success(
                request,
                "Thank you! Your inquiry has been submitted successfully. A confirmation email has been sent to your email address."
            )

            return redirect("contact")

    else:

        form = ContactForm()

    return render(
        request,
        "core/contact.html",
        {
            "form": form
        }
    )
