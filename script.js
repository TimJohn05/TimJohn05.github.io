/*
  Vanilla JS for the static portfolio.
  No framework, no build step, works from file:// and GitHub Pages.
  Project details live in one template and are selected by a query value.
*/

(function () {
  "use strict";

  var mq = window.matchMedia("(min-width: 761px)");

  // Theme toggle. The inline head script applies a saved choice before first paint.
  var themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    var setTheme = function (dark) {
      var root = document.documentElement;
      if (dark) {
        root.dataset.theme = "dark";
      } else {
        delete root.dataset.theme;
      }

      var action = dark ? "Switch to light theme" : "Switch to dark theme";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", action);
      themeToggle.title = action;

      var label = themeToggle.querySelector(".theme-toggle__label");
      if (label) {
        label.textContent = dark ? "Light" : "Dark";
      }

      try {
        localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
      } catch (error) {}
    };

    setTheme(document.documentElement.dataset.theme === "dark");
    themeToggle.addEventListener("click", function () {
      setTheme(document.documentElement.dataset.theme !== "dark");
    });
  }

  // Mobile menu toggle. Escape closes it and returns focus to the button.
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    // A menu opened on mobile should not linger after a resize to desktop.
    var onViewportChange = function (event) {
      if (event.matches) {
        setMenu(false);
      }
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onViewportChange);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(onViewportChange);
    }
  }

  // Footer year.
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // The three real projects. project.html is one template, and the gallery
  // links select a record with a query value such as ?project=techbyte.
  var projects = {
    citisense: {
      title: "CitiSense",
      lede: "Urban feedback app for Calamba City barangays, built with Flutter, Firebase and Cloudinary.",
      main: ["assets/citisense-main.jpg", "CitiSense route view on a phone"],
      desc1: "CitiSense lets citizens report local issues with photos or videos and a map location. Officials resolve those reports with proof photos, and an admin dashboard keeps a log of what happened.",
      desc2: "The app uses Flutter with Firebase and Cloudinary. It includes OpenStreetMap mapping, location and camera access, role based views and signed delivery URLs for video.",
      tools: ["Flutter", "Dart", "Firebase", "Cloudinary", "OpenStreetMap"],
      note: "Source: the CitiSense repository on GitHub.",
      visual1: ["assets/citisense-visual-1.jpg", "CitiSense compass view on a phone", "Compass view on device"],
      visual2: ["assets/citisense-visual-2.jpg", "CitiSense system architecture diagram", "System architecture diagram"],
      next: "techbyte"
    },
    techbyte: {
      title: "TechByte",
      lede: "Offline Android storefront demo with 12 categories, 120 products and 257 variants.",
      main: ["assets/techbyte-main.jpg", "Four TechByte screens captured on a phone"],
      desc1: "TechByte is a storefront demo that runs with no network connection. Its generated catalog has 12 categories, 120 products and 257 variants, each with its own price and stock value. Every product carries three local photos.",
      desc2: "The app covers search, sorting, category chips, pagination, a product gallery, variant selection, an in memory cart and a simulated checkout. The catalog is generated from Python modules, and the four screens below were captured from the app running on a phone.",
      tools: ["Flutter", "Dart", "Material 3", "Provider", "Python"],
      note: "Source: lib/data/mock_products.dart in the local TechByte Flutter project.",
      breakdown: [
        ["CPU", 10, 20],
        ["GPU", 10, 29],
        ["Motherboard", 10, 20],
        ["RAM", 10, 24],
        ["Storages", 10, 20],
        ["PSU", 10, 20],
        ["Case", 10, 20],
        ["Cooling", 10, 20],
        ["Case Fan", 10, 20],
        ["Monitor", 10, 20],
        ["Keyboard", 10, 24],
        ["Mouse", 10, 20]
      ],
      statsCaption: "120 products across 12 categories. Counts from lib/data/mock_products.dart.",
      visual1: ["assets/techbyte-visual-1.jpg", "TechByte catalog and product detail screens on a phone", "Catalog and product detail on phone"],
      visual2: ["assets/techbyte-visual-2.jpg", "TechByte cart and checkout screens on a phone", "Cart and checkout on phone"],
      next: "bash"
    },
    bash: {
      title: "Bash scripts",
      lede: "Small Linux utilities for running Windows tools under Wine without moving to Windows 11.",
      main: ["assets/bash-main.jpg", "Source code of the emu8086.sh Bash launcher"],
      desc1: "The emu8086 launcher starts EMU8086 under Wine. Wine lets me keep working on Linux while running the Windows application this tool needs, so I do not have to use Windows 11. It accepts a Linux or Windows style path to an ASM file and offers a clean command that stops the process and clears build output.",
      desc2: "It also handles XAUTHORITY on Xwayland by preferring the newest mutter token, since a stale token makes Wine fail to open windows. The folder includes short launchers for terminal-doom and a Python drive helper.",
      tools: ["Bash", "Wine", "X11 and Xwayland", "Python"],
      note: "Source: the local Bash-Scripts folder.",
      visual1: ["assets/bash-visual-1.jpg", "Source code of emu8086.sh", "Wine and Xwayland handling in emu8086.sh"],
      visual2: ["assets/bash-visual-2.jpg", "Source code of emu_drive.py", "Python drive helper source"],
      next: "citisense"
    }
  };

  var setText = function (id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };

  var setImage = function (id, pair) {
    var node = document.getElementById(id);
    if (node && pair) {
      node.src = pair[0];
      node.alt = pair[1];
    }
  };

  if (document.getElementById("project-title")) {
    var requested = new URLSearchParams(window.location.search).get("project");
    var slug = Object.prototype.hasOwnProperty.call(projects, requested) ? requested : "citisense";
    var project = projects[slug];

    setText("project-title", project.title);
    setText("project-lede", project.lede);
    setText("project-desc-1", project.desc1);
    setText("project-desc-2", project.desc2);
    setText("project-note", project.note);
    setText("project-visual-1-caption", project.visual1[2]);
    setText("project-visual-2-caption", project.visual2[2]);
    setImage("project-main", project.main);
    setImage("project-visual-1", project.visual1);
    setImage("project-visual-2", project.visual2);

    var tools = document.getElementById("project-tools");
    if (tools) {
      tools.textContent = "";
      project.tools.forEach(function (name) {
        var item = document.createElement("li");
        item.textContent = name;
        tools.appendChild(item);
      });
    }

    var breakdown = document.getElementById("project-breakdown");
    if (breakdown) {
      breakdown.hidden = !project.breakdown;
      if (project.breakdown) {
        setText("project-breakdown-caption", project.statsCaption);
        setText("breakdown-total-products", String(project.breakdown.reduce(function (sum, row) { return sum + row[1]; }, 0)));
        setText("breakdown-total-variants", String(project.breakdown.reduce(function (sum, row) { return sum + row[2]; }, 0)));
        var breakdownBody = document.getElementById("project-breakdown-body");
        if (breakdownBody) {
          breakdownBody.textContent = "";
          project.breakdown.forEach(function (row) {
            var rowNode = document.createElement("tr");
            var nameCell = document.createElement("th");
            nameCell.scope = "row";
            nameCell.textContent = row[0];
            var productCell = document.createElement("td");
            productCell.textContent = String(row[1]);
            var variantCell = document.createElement("td");
            variantCell.textContent = String(row[2]);
            rowNode.appendChild(nameCell);
            rowNode.appendChild(productCell);
            rowNode.appendChild(variantCell);
            breakdownBody.appendChild(rowNode);
          });
        }
      }
    }

    var next = document.getElementById("next-project");
    if (next) {
      next.href = "project.html?project=" + project.next;
    }

    document.title = project.title + " Details | Timothy John Lopez, Computer Science Student";
  }

  // Portfolio filters. The empty state is wired even though every category has work.
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var emptyState = document.querySelector(".grid-empty");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      var shown = 0;

      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });

      galleryItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.hidden = !match;
        if (match) {
          shown += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = shown !== 0;
      }
    });
  });

  // Contact form opens the visitor's email app with the message prefilled.
  // Form messages go to timjohnlopez@gmail.com. Update the address here to change it.
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var formStatus = document.getElementById("form-status");

      if (!form.checkValidity()) {
        if (formStatus) {
          formStatus.textContent = "Nothing was sent. Add your name, a valid email and a message, then try again.";
        }
        return;
      }

      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["message"].value.trim();
      var subject = "Portfolio enquiry from " + name;
      var body = message + "\n\nFrom: " + name + "\nEmail: " + email;

      window.location.href =
        "mailto:timjohnlopez@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      if (formStatus) {
        formStatus.textContent = "Your email app should open with the message ready to send.";
      }
    });
  }
})();
