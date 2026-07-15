from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Machine(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to="machines/")
    description = models.TextField()
    specification = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    brochure = models.FileField(upload_to="brochures/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
# Create your models here
# 
from django.db import models


class Contact(models.Model):

    MACHINE_CHOICES = [
        ("Corrugation Machine", "Corrugation Machine"),
        ("Hydraulic Press", "Hydraulic Press"),
        ("Paper Cutting Machine", "Paper Cutting Machine"),
        ("Box Stitching Machine", "Box Stitching Machine"),
        ("Custom Machine", "Custom Machine"),
    ]

    full_name = models.CharField(max_length=100)

    company_name = models.CharField(max_length=150, blank=True)

    email = models.EmailField()

    phone = models.CharField(max_length=20)

    machine = models.CharField(
        max_length=100,
        choices=MACHINE_CHOICES
    )

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
