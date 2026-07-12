from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, "core/home.html")
from .models import Machine

def products(request):
    machines = Machine.objects.all()

    return render(request,
                  "core/products.html",
                  {"machines": machines})
def about(request):
    return render(request, "core/about.html")