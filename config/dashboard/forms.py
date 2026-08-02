from django import forms
from products.models import Machine, MachineImage


class MachineForm(forms.ModelForm):
    class Meta:
        model = Machine
        fields = [
            "category",
            "name",
            "image",
            "short_description",
            "description",
            "specification",
            "brochure",
        ]

        widgets = {
            "category": forms.Select(attrs={"class": "form-select"}),

            "name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Machine Name"
            }),

            "image": forms.ClearableFileInput(attrs={
                "class": "form-control"
            }),

            "short_description": forms.Textarea(attrs={
                "class": "form-control",
                "rows": 3,
            }),

            "description": forms.Textarea(attrs={
                "class": "form-control",
                "rows": 6,
            }),

            "specification": forms.Textarea(attrs={
                "class": "form-control",
                "rows": 6,
            }),

            "brochure": forms.ClearableFileInput(attrs={
                "class": "form-control"
            }),
        }


class MachineImageForm(forms.ModelForm):
    class Meta:
        model = MachineImage
        fields = ["image"]

        widgets = {
            "image": forms.ClearableFileInput(attrs={
                "class": "form-control"
            }),
        }