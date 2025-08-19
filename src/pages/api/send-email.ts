import type { APIContext, APIRoute } from "astro";
import { zodErrorMap } from "../../lib/zod/error-map";
import { useI18n } from "../../services/i18n";
import type { MailError, MailSuccess } from "../../services/mailer/helpers";
import { sendMail } from "../../services/mailer/mailer";
import { mailData } from "../../services/mailer/schema";
import { HTTP_STATUS } from "../../utils/constants";

export const prerender = false;

/**
 * Handles the `POST` request to generate an endpoint to send emails.
 *
 * @param {APIContext} context - The Astro API context.
 * @returns {Promise<Response>} The response containing either validation errors or the result of the sending.
 */
export const POST: APIRoute = async ({
  currentLocale,
  request,
}: APIContext): Promise<Response> => {
  const { translate } = useI18n(currentLocale);
  const result = mailData.safeParse(await request.formData(), {
    errorMap: zodErrorMap(translate),
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
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: { formErrors: [translate("api.send.email.response.fail")] },
      } satisfies MailError),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE,
        statusText: HTTP_STATUS.INTERNAL_SERVER_ERROR.TEXT,
      }
    );
  }
};
