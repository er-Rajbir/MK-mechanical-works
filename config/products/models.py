from django.db import models



# ==========================================
# CATEGORY
# ==========================================

class Category(models.Model):

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


# ==========================================
# MACHINE
# ==========================================

class Machine(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="machines"
    )

    name = models.CharField(max_length=200)

    image = models.ImageField(
        upload_to="machines/"
    )

    short_description = models.CharField(
        max_length=250,
        blank=True
    )

    description = models.TextField()

    specification = models.TextField(
        blank=True
    )

    brochure = models.FileField(
        upload_to="brochures/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = ["-created_at"]

    def __str__(self):

        return self.name


# ==========================================
# MACHINE GALLERY
# ==========================================

class MachineImage(models.Model):

    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name="gallery"
    )

    image = models.ImageField(
        upload_to="machines/gallery/"
    )

    def __str__(self):

        return f"{self.machine.name} Image"


# ==========================================
# CONTACT
# ==========================================

class Contact(models.Model):

    full_name = models.CharField(max_length=120)

    company_name = models.CharField(
        max_length=150,
        blank=True
    )

    email = models.EmailField()

    phone = models.CharField(max_length=20)

    machine = models.ForeignKey(
        Machine,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ["-created_at"]

    def __str__(self):

        return self.full_name