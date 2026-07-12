from django.db import models


class Product(models.Model):

    CATEGORY_CHOICES = [
        ("Mixing", "Mixing Machine"),
        ("Packing", "Packing Machine"),
        ("Conveyor", "Conveyor"),
        ("Crusher", "Crusher"),
        ("Dryer", "Dryer"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=200)

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="Other"
    )

    image = models.ImageField(upload_to="products/")

    short_description = models.CharField(max_length=300)

    description = models.TextField()

    price_range = models.CharField(
        max_length=100,
        blank=True
    )

    model_number = models.CharField(
        max_length=100,
        blank=True
    )

    weight = models.CharField(
        max_length=100,
        blank=True
    )

    height = models.CharField(
        max_length=100,
        blank=True
    )

    dimensions = models.CharField(
        max_length=100,
        blank=True
    )

    power = models.CharField(
        max_length=100,
        blank=True
    )

    voltage = models.CharField(
        max_length=100,
        blank=True
    )

    capacity = models.CharField(
        max_length=100,
        blank=True
    )

    material = models.CharField(
        max_length=150,
        blank=True
    )

    warranty = models.CharField(
        max_length=100,
        blank=True
    )

    applications = models.TextField(blank=True)

    features = models.TextField(blank=True)


    working_principle = models.TextField(blank=True)

    video_link = models.URLField(blank=True)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="products/gallery/"
    )

    def __str__(self):
        return f"{self.product.name} Image"