export const rate_header = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Responsive HTML Email With Button</title>
    <style>
      /* ------------------------------------- GLOBAL RESETS ------------------------------------- */ /*All the styling goes here*/
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
      }
      body {
        background-color: #ffffff;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        min-width: 100%;
        width: 100%;
      }
      table td {
        font-family: sans-serif;
        font-size: 14px;
        vertical-align: top;
      }
      table.rates {
        margin-bottom: 3em;
      }
      table.rates tr th {
        padding-bottom: 1em;
      }
      table.rates tr td {
        font-size: 16px;
        padding: 1em 0 0.2em;
      } /* ------------------------------------- BODY & CONTAINER ------------------------------------- */
      .body {
        background-color: #ffffff;
        width: 100%;
      } /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        margin: 0 auto !important; /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px;
      } /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px;
      } /* ------------------------------------- HEADER, FOOTER, MAIN ------------------------------------- */
      .main {
        background: #ffffff;
        border-style: solid;
        border-width: 1px;
        border-radius: 3px;
        width: 100%;
      }
      .header {
        padding: 20px 0;
      }
      .wrapper {
        box-sizing: border-box;
        padding: 20px;
      }
      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%;
      }
      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: #9a9ea6;
        font-size: 12px;
        text-align: center;
      } /* ------------------------------------- TYPOGRAPHY ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #06090f;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px;
      }
      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize;
      }
      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px;
      }
      p li,
      ul li,
      ol li {
        list-style-position: inside;
        margin-left: 5px;
      }
      a {
        color: #06d68a;
        text-decoration: underline;
      } /* ------------------------------------- BUTTONS ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%;
      }
      .btn > tbody > tr > td {
        padding-bottom: 15px;
      }
      .btn table {
        min-width: auto;
        width: auto;
      }
      .btn table td {
        background-color: #ffffff;
        border-radius: 5px;
        text-align: center;
      }
      .btn a {
        background-color: #101010;
        border: solid 1px #101010;
        border-radius: 5px;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding: 12px 25px;
        text-decoration: none;
        text-transform: capitalize;
      }
      .btn-primary table td {
        background-color: #101010;
      }
      .btn-primary a {
        background-color: #101010;
        border-color: #101010;
        color: #ffffff;
      } /* ------------------------------------- OTHER STYLES THAT MIGHT BE USEFUL ------------------------------------- */
      .last {
        margin-bottom: 0;
      }
      .first {
        margin-top: 0;
      }
      .align-center {
        text-align: center;
      }
      .align-right {
        text-align: right;
      }
      .align-left {
        text-align: left;
      }
      .clear {
        clear: both;
      }
      .mt0 {
        margin-top: 0;
      }
      .mb0 {
        margin-bottom: 0;
      }
      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }
      .powered-by a {
        text-decoration: none;
      }
      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        margin: 20px 0;
      } /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class="body"] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table[class="body"] p,
        table[class="body"] ul,
        table[class="body"] ol,
        table[class="body"] td,
        table[class="body"] span,
        table[class="body"] a {
          font-size: 16px !important;
        }
        table[class="body"] .wrapper,
        table[class="body"] .article {
          padding: 10px !important;
        }
        table[class="body"] .content {
          padding: 0 !important;
        }
        table[class="body"] .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table[class="body"] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table[class="body"] .btn table {
          width: 100% !important;
        }
        table[class="body"] .btn a {
          width: 100% !important;
        }
        table[class="body"] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        .btn-primary table td:hover {
          background-color: #000 !important;
        }
        .btn-primary a:hover {
          background-color: #000 !important;
          border-color: #000 !important;
        }
      }
    </style>
  </head>
  <body class="">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="header">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="align-center" width="100%">
                  <h4 style="color: #444444; font-weight: bold;">Rate Sponsor</h4>
                </td>
              </tr>

              <tr>
                <td class="align-center" width="100%">
                  <a href="https://bit.ly/4dPkBRk">
                    <img src="https://ik.imagekit.io/monierate/partners/cedar-wordmark-dark.png" height="24px" alt="Cedar" />
                  </a>
                </td>
              </tr>
            </table>

          </div>

          <div class="content">
            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">What will you do if you have a million dollar?</span>

            <!-- partner section -->
            <table role="presentation" class="main" style="margin-bottom: 30px; border-color: purple;">
              <tr class="wrapper">
                <td>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <!-- partner image -->
                    <tr>
                      <td class="wrapper" style="padding-bottom: 5px;">
                        <strong>Enjoy frictionless cross-border payments solution for businesses, with CEDAR MONEY.</strong>
                      </td>
                    </tr>
              
                    <!-- partner image -->
                    <tr>
                      <td class="wrapper" style="padding-bottom: 5px;">
                        <a href="https://bit.ly/4dPkBRk">
                          <img src="https://ik.imagekit.io/monierate/cedar-newsletter.gif?updatedAt=1725875673839" />
                        </a>
                      </td>
                    </tr>
                    <!-- partner call to action text -->
                    <tr>
                      <td class="wrapper">
                        <p align="left" style="margin-bottom: 2px; font-style: italic;">
                          Join businesses in Nigeria, Kenya and Ivory Coast, and enjoy fast and reliable global payments with Cedar.
                          <a href="https://bit.ly/4dPkBRk">Sign up today.</a>.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- end partner section -->

            <!-- rate content -->
            <table role="presentation" class="main" style="margin-bottom: 30px; border-color: black;">
              <tr>
                <td class="wrapper">
`;