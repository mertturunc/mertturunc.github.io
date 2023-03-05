function addContentToSidebar(marker) {
    const { id, title, small, description, img, coords } = marker;
    const smallInfo = small !== undefined ? `<small>${small}</small>` : "";
  
    // create sidebar content
    const sidebarTemplate = `
      <article class="sidebar-content">
        <h1>${title}</h1>
        <div class="marker-id">${id}</div>
        <div class="info-content">
          <img class="img-zoom" src="${img.src}" alt="${img.alt}">
          ${smallInfo}
          <div class="info-description">${description}</div>
        </div>
      </article>
    `;
  
    const sidebar = document.querySelector(".sidebar");
    const sidebarContent = document.querySelector(".sidebar-content");
  
    // always remove content before adding new one
    sidebarContent?.remove();
  
    // add content to sidebar
    sidebar.insertAdjacentHTML("beforeend", sidebarTemplate);
  
    // set bounds depending on marker coords
    boundsMap(coords);
  }
  
  export default addContentToSidebar;
  