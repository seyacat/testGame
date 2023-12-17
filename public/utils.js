const GCard = (data) => {
  const card = document.createElement("g-card");
  card.setAttribute("draggable", "true");

  card.innerHTML = `<button class="g-card"> ${JSON.stringify(data)}  </button>`;
  return card;
};
