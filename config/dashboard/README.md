# Owner Dashboard — Integration Guide

A self-contained Django app (`dashboard`) that adds an owner-only
admin panel: login, a Contact Queries inbox, and full CRUD for
Products (Machines). Styled to match your existing site using the
same tokens/fonts from `style.css`.

## 1. Copy the app in

Copy this whole `dashboard/` folder into your project root, next to
your other apps (e.g. next to `core/`).

## 2. Register the app

In `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'dashboard',
]
```

## 3. Point it at your real Machine model

`dashboard/forms.py` and `dashboard/views.py` both start with:

```python
from core.models import Machine
```

Change `core.models` to wherever your `Machine` model actually lives
if it's a different app.

## 4. Wire up the URLs

In your project's main `urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    ...
    path('dashboard/', include('dashboard.urls')),
]
```

## 5. Point Django's login redirect at the dashboard login page

In `settings.py`:

```python
LOGIN_URL = 'dashboard_login'
```

## 6. Add the unread-queries context processor

In `settings.py`, inside `TEMPLATES[0]['OPTIONS']['context_processors']`,
add:

```python
'dashboard.context_processors.unread_queries',
```

(Django's default `django.template.context_processors.request` must
also be present — it already is in a standard Django project — since
the sidebar nav relies on `request.resolver_match`.)

## 7. Migrate

```bash
python manage.py makemigrations dashboard
python manage.py migrate
```

## 8. Create the owner's login

Only accounts with `is_staff=True` can log into `/dashboard/` —
regular site visitors never have accounts at all, so this alone
keeps it owner-only:

```bash
python manage.py createsuperuser
```

## 9. Save incoming contact-form submissions

Update your existing contact view (wherever `contact.html` is
rendered) to also create a `ContactQuery` row on successful
submission. Merge this into your existing logic rather than
replacing it outright:

```python
from dashboard.models import ContactQuery

def contact(request):
    form = ContactForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        ContactQuery.objects.create(
            full_name=form.cleaned_data['full_name'],
            company_name=form.cleaned_data.get('company_name', ''),
            email=form.cleaned_data['email'],
            phone=form.cleaned_data['phone'],
            machine=form.cleaned_data.get('machine', ''),
            message=form.cleaned_data['message'],
        )
        messages.success(request, "Thank you! We'll get back to you within 24 hours.")
        return redirect('contact')

    return render(request, 'core/contact.html', {'form': form})
```

## 10. Visit the dashboard

```
/dashboard/login/
```

---

### What's included

| File | Purpose |
|---|---|
| `models.py` | `ContactQuery` — stores every contact-form submission |
| `forms.py` | `OwnerLoginForm`, `MachineForm` (add/edit products) |
| `decorators.py` | `owner_required` — login + `is_staff` check on every view |
| `context_processors.py` | Feeds the sidebar's unread-query badge |
| `views.py` | Login/logout, dashboard overview, query list/detail/delete, full product CRUD |
| `urls.py` | All `/dashboard/...` routes |
| `templates/dashboard/` | Sidebar shell + login + all CRUD screens |
| `static/dashboard/css/dashboard.css` | Layout CSS — built entirely on your existing `style.css` variables |

### Notes

- Contact queries are **read + delete only** from the dashboard (they
  arrive from the public form) — there's no "add query" screen.
- Products (machines) have **full CRUD** — add, edit, delete, list
  with search.
- The sidebar "Contact Queries" link shows a red badge with the
  unread count.
- If you'd rather manage staff accounts (add more owners/employees
  later) through a UI, Django's built-in `/admin/` still works
  alongside this — nothing here disables it.
