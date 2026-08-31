from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .chatbot import chatbot_response


@api_view(["POST"])
def chat(request):

    message = request.data.get(
        "message",
        ""
    ).strip()

    if not message:
        return Response(
            {
                "detail": "Pesan tidak boleh kosong."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    answer = chatbot_response(message)

    return Response(
        {
            "message": message,
            "answer": answer
        },
        status=status.HTTP_200_OK
    )