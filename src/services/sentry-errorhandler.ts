// From: https://gonehybrid.com/how-to-log-errors-in-your-ionic-2-app-with-sentry/

// create release: sentry-cli releases -o "ipaymyway" -p "share" new 1.3.0

// upload source maps:
// sentry-cli releases -o "ipaymyway" -p "share" files 1.3.0 upload-sourcemaps --url-prefix / www/build

import { IonicErrorHandler } from 'ionic-angular';  
import Raven from 'raven-js';

import { ENV } from '@app/env';

Raven  
    .config(ENV.raven.appKey, 
        { 
            release: ENV.release, 
            dataCallback: data => {

                if (data.culprit) {
                    data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
                }

                var stacktrace = data.stacktrace || 
                                 data.exception && 
                                 data.exception.values[0].stacktrace;

                if (stacktrace) {
                    stacktrace.frames.forEach(function (frame) {
                        frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
                    });
                }
            } 
        })
    .install();

export class SentryErrorHandler extends IonicErrorHandler {

    handleError(error) {
        super.handleError(error);

        try {
          Raven.captureException(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }
    }
}