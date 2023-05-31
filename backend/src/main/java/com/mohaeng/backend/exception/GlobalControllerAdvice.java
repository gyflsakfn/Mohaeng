package com.mohaeng.backend.exception;

import com.mohaeng.backend.exception.badrequest.BadRequestException;
import com.mohaeng.backend.exception.notfound.NotFoundException;
import com.mohaeng.backend.exception.unauthrized.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import static com.mohaeng.backend.exception.ErrorCode.*;

@RestControllerAdvice
@Slf4j
public class GlobalControllerAdvice {

    private static final String LOG_FORMAT = "Class : {}, Code : {}, Message : {}";

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFoundException(NotFoundException e) {
        log.info(LOG_FORMAT, e.getClass().getSimpleName(), e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ExceptionResponse.from(e.getErrorCode(), e.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ExceptionResponse> handleBadRequestException(BadRequestException e) {
        log.info(LOG_FORMAT, e.getClass().getSimpleName(), e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ExceptionResponse.from(e.getErrorCode(), e.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ExceptionResponse> handleUnauthorizedException(UnauthorizedException e) {
        log.info(LOG_FORMAT, e.getClass().getSimpleName(), e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ExceptionResponse.from(e.getErrorCode(), e.getMessage()));
    }

    /** @PathVariable, url exception 처리 (숫자 대신 문자가 넘어올때,,) **/
    @ExceptionHandler({BindException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ExceptionResponse> handleInvalidQueryParameterException(Exception e) {
        log.info(LOG_FORMAT, e.getClass().getSimpleName(), INVALID_PATH_VARIABLE, "요청으로 넘어온 값 타입이 형식에 맞지 않습니다.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ExceptionResponse.from(INVALID_PATH_VARIABLE, "요청으로 넘어온 값 타입이 형식에 맞지 않습니다."));
    }

    /** @RequestBody @Valid exception 처리 **/
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(MethodArgumentNotValidException e) {
        log.info(LOG_FORMAT, e.getClass().getSimpleName(), INVALID_REQUEST_BODY, e.getMessage());
        return ResponseEntity.badRequest()
                .body(ExceptionResponse.from(INVALID_REQUEST_BODY, "필수값이 입력되지 않았습니다."));
    }

}
