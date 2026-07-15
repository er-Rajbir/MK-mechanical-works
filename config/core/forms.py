from django import forms
from .models import Contact


class ContactForm(forms.ModelForm):

    class Meta:

        model = Contact

        fields = "__all__"

        widgets = {

            "full_name": forms.TextInput(attrs={
                "class": "form-control custom-input",
                "placeholder": "Full Name"
            }),

            "company_name": forms.TextInput(attrs={
                "class": "form-control custom-input",
                "placeholder": "Company Name"
            }),

            "email": forms.EmailInput(attrs={
                "class": "form-control custom-input",
                "placeholder": "Email"
            }),

            "phone": forms.TextInput(attrs={
                "class": "form-control custom-input",
                "placeholder": "Phone Number"
            }),

            "machine": forms.Select(attrs={
                "class": "form-select custom-input"
            }),

            "message": forms.Textarea(attrs={
                "class": "form-control custom-input",
                "rows": 6,
                "placeholder": "Tell us your requirements..."
            }),
        }