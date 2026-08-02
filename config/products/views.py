from django.shortcuts import render, get_object_or_404
from .models import Machine


def product_list(request):
    machines = Machine.objects.all()

    return render(
        request,
        "products/product_list.html",
        {
            "machines": machines,
        },
    )


def product_detail(request, id):
    machine = get_object_or_404(Machine, id=id)

    return render(
        request,
        "products/product_detail.html",
        {
            "machine": machine,
        },
    )
