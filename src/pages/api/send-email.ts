import type { APIRoute } from "astro";
import { zodErrorMap } from "../../lib/zod/error-map";
import type { MailError, MailSuccess } from "../../services/mailer/helpers";
import { sendMail } from "../../services/mailer/mailer";
import { mailData } from "../../services/mailer/schema";
import { HTTP_STATUS } from "../../utils/constants";
import { useI18n } from "../../utils/i18n";

export const prerender = false;

export const POST: APIRoute = async ({
  currentLocale,
  request,
}): Promise<Response> => {
  const { locale, translate } = useI18n(currentLocale);
  const result = mailData.safeParse(await request.formData(), {
    errorMap: zodErrorMap(locale),
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.flatten() }), {
      status: HTTP_STATUS.BAD_REQUEST.CODE,
      statusText: HTTP_STATUS.BAD_REQUEST.TEXT,
    });
  }

  try {
    await sendMail(result.data);

    return new Response(
      JSON.stringify({
        message: translate("api.send.email.response.sent"),
      } satisfies MailSuccess),
      {
        status: HTTP_STATUS.OK.CODE,
        statusText: HTTP_STATUS.OK.TEXT,
      },
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        error: { formErrors: [translate("api.send.email.response.fail")] },
      } satisfies MailError),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE,
        statusText: HTTP_STATUS.INTERNAL_SERVER_ERROR.TEXT,
      },
    );
  }
};