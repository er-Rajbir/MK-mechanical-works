from functools import wraps

from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.contrib import messages


def owner_required(view_func):
    """
    Combines login_required with an is_staff check, so only the
    website owner's account (created with is_staff=True, e.g. via
    `python manage.py createsuperuser`) can reach dashboard pages.

    Regular site visitors never have accounts at all, so this alone
    is enough to keep the dashboard owner-only — no separate
    "client" login exists anywhere on the public site.
    """

    @wraps(view_func)
    @login_required(login_url='dashboard_login')
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_staff:
            messages.error(request, "You don't have access to the owner dashboard.")
            return redirect('dashboard_login')
        return view_func(request, *args, **kwargs)

    return _wrapped
