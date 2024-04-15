import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class SocketExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {

        const socket = host.switchToWs().getClient()

        return socket.emit(

            "exception",
            {
                status: exception.getStatus(),
                err: exception.getResponse(),
            }
        )

    }
}