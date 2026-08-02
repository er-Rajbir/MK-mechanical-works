from .models import ContactQuery


def unread_queries(request):
    """
    Makes `unread_count` available in every dashboard template so the
    sidebar can show a badge next to "Contact Queries", without every
    view needing to pass it explicitly.
    """
    if request.path.startswith('/dashboard') and request.user.is_authenticated and request.user.is_staff:
        return {'unread_count': ContactQuery.objects.filter(is_read=False).count()}
    return {}
