/**
 * HEADER
 */

exports.header = (title, script) => {

    const header = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/game/favicon.ico">

        <title>${title}</title>

        <script src="https://code.jquery.com/jquery-3.6.1.js"
        integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
        crossorigin="anonymous"></script>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">

        <link rel="stylesheet" href="/css/styles.css">

        <script src="/script//utils/logout.js"></script>
        <script src="/script/${script}.js"></script>
        <script>
        function uploadImage(input) {
            const jInput = $(input);
            const div = jInput.siblings(".imageUploaderReceiver");
            try {
                const form = jInput.parent("form").get(0);
                const url = form.action;
                div.html("");

                const formData = new FormData(form);
                fetch(url, {
                    method: 'POST',
                    body: formData,
                }).
                then(response => response.json()).
                then(data => {
                    if (data.url == null) {
                        throw new Error("Image url is " + data.url);
                    }
                    div.html(data.url);
                }).
                catch(error => {
                    div.html("");
                    alert("Errore durante il caricamento dell'immagine. Controllare se l'immagine selezionata sia corretta.");
                    console.error(error);
                });
            } catch (error) {
                div.html("");
                alert("Errore durante il caricamento dell'immagine. Controllare se l'immagine selezionata sia corretta.");
                console.error(error);
            }
        }
        </script>
    </head>`

    return header
}

/**
 * SCRIPTS
 */
exports.scripts = () => {

    const scripts = `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofN4zfuZxLkoj1gXtW8ANNCe9d5Y3eG5eD" crossorigin="anonymous"></script>
    `

    return scripts
}
