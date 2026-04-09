import time
import logging
from fastapi import Request

logger = logging.getLogger("app.request")


async def logging_middleware(request: Request, call_next):
    start_time = time.time()

    try:
        response = await call_next(request)
    except Exception as e:
        duration = time.time() - start_time

        logger.error(
            "request_failed",
            extra={
                "method": request.method,
                "path": request.url.path,
                "error": str(e),
                "duration": round(duration, 4),
            },
        )
        raise

    duration = time.time() - start_time

    logger.info(
        "request",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration": round(duration, 4),
        },
    )

    return response
