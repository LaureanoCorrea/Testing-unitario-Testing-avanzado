document.addEventListener("DOMContentLoaded", function () {
  const socket = io(); //configuración para poder usar socket del lado del cliente
  console.log("Conectado al servidor de socket");

  socket.emit("message1", "Conectado con websocket");

  function addProduct() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = document.getElementById("price").value;
    let thumbnail = document.getElementById("thumbnail").value;
    let code = document.getElementById("code").value;
    let stock = document.getElementById("stock").value;
    let status = document.getElementById("status").value;
    let category = document.getElementById("category").value;

    if (
      !title ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category ||
      !status
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios",
      });
      return false;
    }

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };

    socket.emit("addProduct", product);
    document.getElementById("form_add").reset();
  }
  // Socket realtimeProducts
  function deleteProduct(pid) {
    socket.emit("deleteProduct", { _id: pid });
  }

  socket.on("productsList", (data) => {
    const productList = document.getElementById("productList");

    if (productList && Array.isArray(data)) {
      productList.innerHTML = "";

      const table = document.createElement("table");
      table.id = "product_table";
      table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Código</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

      data.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>$${product.price}</td>
                <td>${product.code}</td>
                <td><button type="button" class="delete_button" onclick="deleteProduct('${product._id}')">X</button></td>
            `;
        table.querySelector("tbody").appendChild(row);
      });

      productList.appendChild(table);
    } else {
      console.log(`Faltan Datos.`, productList);
    }
  });

  //Modal para ingresar el mail
  // Swal.fire({
  //   title: "Ingresa tu e-mail para poder continuar",
  //   input: "email",
  //   text: "Ingresa e-mail",
  //   inputValidator: (value) => {
  //     return !value && "Datos requeridos";
  //   },
  //   allowOutsideClick: false,
  // }).then((result) => {
  //   email = result.value;
  // });

  //lógica del chat
  const chatbox = document.getElementById("chatbox");
  if (chatbox) {
    chatbox.addEventListener("keyup", function (evt) {
      if (evt.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
          socket.emit("message", { email, message: chatbox.value });
          chatbox.value = "";
        }
      }
    });
  }

  socket.on("messageLogs", (data) => {
    let messageLogs = document.querySelector("#messageLogs");
    let mensajes = "";
    data.forEach((mensaje) => {
      if (mensaje.email === email) {
        mensajes += `<p class="self-message"><strong>You:</strong> ${mensaje.message}</p>`;
      } else {
        mensajes += `<p class="other-message"><strong>${mensaje.email}:</strong> ${mensaje.message}</p>`;
      }
    });

    messageLogs.innerHTML = mensajes;
    messageLogs.scrollTop = messageLogs.scrollHeight;

    function logout() {
      document.cookie =
        "cookieToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload(true);
      window.location.href = "/login";
    }
  });

  //fin del DOMContentLoad
});
