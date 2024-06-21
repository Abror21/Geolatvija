<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Ubuntu', sans-serif;
        }

        .container {
            width: 100%;
            text-align: center;
            padding-top: 32px;
            padding-bottom: 32px;
        }

        .title {
            font-weight: bold;
        }

        .button {
            color: white !important;
            border-radius: 32px;
            border: none;
            background-color: #518B33;
            font-size: 1.2rem;
            padding: 12px 32px;
            margin-top: 32px;
            margin-bottom: 32px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }

        .button:hover {
            background-color: #518B33;
        }

        .link {
            text-decoration: underline;
            color: black !important;
        }

        .question-label {
            font-size: 14px;
            color: black;
        }
    </style>
</head>

<body>
<table class="container">
    <tr>
        <td colspan="2">
            <img width="150" height="auto" src="{{ $logoUrl }}" alt="Logo">
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <label class="title">Apstipriniet e-pasta adresi.</label>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <label>Lai apstiprinātu e-pasta adresi, nospiediet uz interneta saiti.</label>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <a href="{{$url}}" class="button">Apstiprināt e-pastu</a>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <label>Ja jūs nepieprasījāt e-pasta adreses verifikāciju, droši ignorējiet šo e-pastu.</label>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <label class="question-label">Jautājumi? <a href="mailto:atbalsts@vraa.gov.lv" class="link">Mēs esam šeit lai palīdzētu.</a></label>
        </td>
    </tr>
</table>
</body>
</html>
