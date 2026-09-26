
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from products.models import Machine

import os
import requests

from .forms import ContactForm
from products.models import Contact

from django.shortcuts import render

from products.models import Machine


def gallery(request):
    """
    Public gallery page.

    Displays:
    - Main image of every machine
    - Additional MachineImage gallery images
    - Machine category
    - Machine name
    """

    machines = (
        Machine.objects
        .select_related("category")
        .prefetch_related("gallery")
        .order_by("-created_at")
    )

    context = {
        "machines": machines,
    }

    return render(
        request,
        "core/gallery.html",
        context
    )


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

            # Save enquiry first
            inquiry = form.save()

            try:

                # ==========================================
                # RESEND API
                # ==========================================

                resend_api_key = os.environ.get("RESEND_API_KEY")

                headers = {
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json",
                }

                # ==========================================
                # EMAIL TO WEBSITE OWNER
                # ==========================================

                owner_email = {

                    "from": "MK Industries <anandrajbir13@gmail.com>",
                    
                    

                    "to": [
                        "mandeepsingh88406@gmail.com"
                    ],

                    "subject": f"New Inquiry from {inquiry.full_name}",

                    "text": f"""
New Contact Inquiry

Name: {inquiry.full_name}
Company: {inquiry.company_name}
Phone: {inquiry.phone}
Email: {inquiry.email}

Machine:
{inquiry.machine}

Message:
{inquiry.message}
"""
                }

                owner_response = requests.post(
                    "https://api.resend.com/emails",
                    headers=headers,
                    json=owner_email,
                    timeout=20
                )

                # ==========================================
                # CONFIRMATION EMAIL TO CUSTOMER
                # ==========================================

                customer_email = {

                    "from": "MK Industries <anandrajbir13@gmail.com>",

                    "to": [
                        inquiry.email
                    ],

                    "subject": "Thank You for Contacting MK Industries",

                    "text": f"""
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

- Premium Quality Machines
- Reliable Technical Support
- Competitive Pricing
- Timely Delivery
- Customized Manufacturing Solutions

If you have any urgent questions, feel free to reply to this email or contact us directly.

Thank you for choosing MK Industries.

Best Regards,

MK Industries
Industrial Machinery Manufacturer

Email : info@mkindustries.com
Phone : +91 XXXXX XXXXX
Website : www.mkindustries.com
"""
                }

                customer_response = requests.post(
                    "https://api.resend.com/emails",
                    headers=headers,
                    json=customer_email,
                    timeout=20
                )

                # ==========================================
                # CHECK EMAIL RESULTS
                # ==========================================

                print(
                    "OWNER EMAIL:",
                    owner_response.status_code,
                    owner_response.text
                )

                print(
                    "CUSTOMER EMAIL:",
                    customer_response.status_code,
                    customer_response.text
                )

                if owner_response.ok and customer_response.ok:

                    messages.success(
                        request,
                        "Thank you! Your inquiry has been submitted successfully. A confirmation email has been sent to your email address."
                    )

                else:

                    messages.warning(
                        request,
                        "Your inquiry was received successfully, but we could not send the email notification right now."
                    )

            except Exception as e:

                # The enquiry is already saved.
                # Only the email failed.

                print("EMAIL ERROR:", e)

                messages.warning(
                    request,
                    "Your inquiry was received successfully, but we could not send the email notification right now."
                )

            return redirect("core:contact")

    else:

        form = ContactForm()

    return render(
        request,
        "core/contact.html",
        {
            "form": form
        }
    )

