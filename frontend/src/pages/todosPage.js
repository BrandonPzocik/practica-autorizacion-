export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  const btnHome = document.createElement("button");

  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );

  btnHome.textContent = "Home";

  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");

  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const table = document.createElement("table");

  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";

  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Acciones";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");

  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      data.todos.forEach((todo) => {
        if (todo.id > 10) return;

        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        td4.textContent = todo.owner;

        const td5 = document.createElement("td");
        td5.classList.add("border", "px-4", "py-2");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add(
          "bg-red-500",
          "text-white",
          "px-2",
          "py-1",
          "rounded"
        );
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add(
          "bg-blue-500",
          "text-white",
          "px-2",
          "py-1",
          "rounded",
          "mr-2"
        );

        // Modal HTML
        const modal = document.createElement("div");
        modal.classList.add(
          "fixed",
          "top-0",
          "left-0",
          "w-full",
          "h-full",
          "flex",
          "items-center",
          "justify-center",
          "bg-gray-800",
          "bg-opacity-50",
          "hidden"
        );
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-white", "p-4", "rounded", "w-1/3");
        modalContent.innerHTML = `
          <h2 class="text-xl font-bold mb-2">Edit Todo</h2>
          <input id="modal-title" class="border p-2 w-full mb-2" placeholder="Title" value="${
            todo.title
          }">
          <input id="modal-completed" type="checkbox" ${
            todo.completed ? "checked" : ""
          }> Completed
          <div class="flex justify-end mt-2">
            <button id="modal-save" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button id="modal-close" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
          </div>
        `;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        editButton.addEventListener("click", () => {
          modal.classList.remove("hidden");

          const saveButton = document.getElementById("modal-save");
          const closeButton = document.getElementById("modal-close");

          saveButton.addEventListener("click", () => {
            const title = document.getElementById("modal-title").value;
            const completed =
              document.getElementById("modal-completed").checked;

            fetch(`http://localhost:4000/todos/${todo.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                title,
                completed,
                owner: todo.owner,
              }),
            }).then(() => {
              window.location.reload();
            });
          });

          closeButton.addEventListener("click", () => {
            modal.classList.add("hidden");
          });
        });

        deleteButton.addEventListener("click", async () => {
          try {
            const response = await fetch(
              `http://localhost:4000/todos/${todo.id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (response.ok) {
              tr.remove();
            } else {
              console.error("Error al eliminar la tarea.");
            }
          } catch (error) {
            console.error("Hubo un error al conectarse al servidor:", error);
          }
        });

        td5.appendChild(deleteButton);
        td5.appendChild(editButton);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    });

  container.appendChild(title);
  container.appendChild(table);

  return container;
};
