// Router
window.router = (pageId) => {
  document
    .querySelectorAll(".app-page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));

  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document
      .querySelector(`.nav-btn[onclick="router('${pageId}')"]`)
      ?.classList.add("active");
  }

  if (pageId === "schedule") {
    showView("classes"); // default to classes view when schedule loads

    const tab =
      document.querySelector(".day-tab.active") ||
      document.querySelector('.day-tab[data-day="friday"]');
    if (tab) {
      document
        .querySelectorAll(".day-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderDay(tab.dataset.day);
    }
  }

  history.pushState({ page: pageId }, "", `#${pageId}`);
};

window.onpopstate = (e) =>
  router(e.state?.page || location.hash.slice(1) || "home");

// Schedule data
const scheduleData = {
  friday: [
    {
      time: "11:00 - 12:30",
      rooms: [
        {
          room: "Hamilton",
          instructor: "Kimberley",
          design: "Squishy Cuties",
          badge: "BF",
        },
        { room: "Neville", instructor: "Irina", design: "Owl" },
        { room: "Mortimer", instructor: "Alberto", design: "Old is Gold" },
        {
          room: "Beaufort",
          instructor: "",
          design: "",
        },
      ],
    },
    {
      time: "14:00 - 15:30",
      rooms: [
        {
          room: "Hamilton",
          instructor: "Kimberley",
          design: "Pop-ular Designs",
        },
        {
          room: "Neville",
          instructor: "Gergo",
          design: "Dino Costume",
          badge: "Bonus",
        },
        { room: "Mortimer", instructor: "Alberto", design: "10 E.Q.T." },
        {
          room: "Beaufort",
          instructor: "Denise",
          design: "Big Cute Class",
          badge: "BF",
        },
      ],
    },
    {
      time: "16:00 - 17:30",
      rooms: [
        { room: "Hamilton", instructor: "Kimberley", design: "Squishy Cuties" },
        {
          room: "Neville",
          instructor: "Irina",
          design: "Soldier",
          badge: "BF",
        },
        { room: "Mortimer", instructor: "", design: "" },
        { room: "Beaufort", instructor: "Denise", design: "Twist Lab" },
      ],
    },
  ],
  saturday: [
    {
      time: "10:30 - 12:00",
      rooms: [
        { room: "Hamilton", instructor: "", design: "" },
        { room: "Neville", instructor: "Irina", design: "Owl" },
        {
          room: "Mortimer",
          instructor: "Alberto",
          design: "10 E.Q.T.",
          badge: "BF",
        },
        { room: "Beaufort", instructor: "Denise", design: "Twist Lab" },
      ],
    },
    {
      time: "14:00 - 15:30",
      rooms: [
        {
          room: "Hamilton",
          instructor: "Kimberley",
          design: "Pop-ular Designs",
          badge: "BF",
        },
        { room: "Neville", instructor: "Irina", design: "Soldier" },
        { room: "Mortimer", instructor: "Alberto", design: "Old is Gold" },
        {
          room: "Beaufort",
          instructor: "Audrey",
          design: "Deco-twisting",
          badge: "Bonus",
        },
      ],
    },
    {
      time: "16:00 - 17:30",
      rooms: [
        { room: "Hamilton", instructor: "Kimberley", design: "Squishy Cuties" },
        {
          room: "Neville",
          instructor: "Gergo",
          design: "Dino Costume",
          badge: "Bonus",
        },
        {
          room: "Mortimer",
          instructor: "Alberto",
          design: "Old is Gold",
          badge: "BF",
        },
        { room: "Beaufort", instructor: "Denise", design: "Big Cute Class" },
      ],
    },
  ],
  sunday: [
    {
      time: "10:30 - 12:00",
      rooms: [
        {
          room: "Hamilton",
          instructor: "Kimberley",
          design: "Pop-ular Designs",
        },
        { room: "Neville", instructor: "Irina", design: "Owl", badge: "BF" },
        { room: "Mortimer", instructor: "", design: "" },
        { room: "Beaufort", instructor: "Denise", design: "Big Cute Class" },
      ],
    },
    {
      time: "13:30 - 15:00",
      rooms: [
        { room: "Hamilton", instructor: "", design: "" },
        { room: "Neville", instructor: "Irina", design: "Soldier" },
        { room: "Mortimer", instructor: "Alberto", design: "10 E.Q.T." },
        {
          room: "Beaufort",
          instructor: "Denise",
          design: "Twist Lab",
          badge: "BF",
        },
      ],
    },
  ],
};

// Render function
function renderDay(day) {
  const container = document.getElementById("classes-container");

  // Start fade out
  container.classList.add("fade");

  setTimeout(() => {
    // Build new HTML
    const slots = scheduleData[day] || [];
    let html = "";

    slots.forEach((slot) => {
      html += `
        <div class="time-block">
          <div class="time-header">${slot.time}</div>
          <div class="rooms-grid">
            ${["Hamilton", "Neville", "Mortimer", "Beaufort"]
              .map((roomName) => {
                const room = slot.rooms.find((r) => r.room === roomName) || {
                  instructor: "",
                  design: "",
                  badge: "",
                };

                let content = `No Class`;
                if (room.instructor || room.design) {
                  content = `
                    <div class="session">
                      <span class="instructor">${room.instructor || "?"}</span>
                      <span class="design">${room.design || ""}</span>
                      ${room.badge ? `<span class="badge badge-${room.badge.toLowerCase()}">${room.badge}</span>` : ""}
                    </div>
                  `;
                }

                return `
                  <div class="room-column">
                    <div class="room-label">
                      <span class="room-emoji">${getRoomEmoji(roomName)}</span>
                      ${roomName}
                    </div>
                    <div class="room-content ${!room.instructor && !room.design ? "empty" : ""}">
                      ${content}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <h3 class="day-title">${day}</h3>
      ${html || '<p class="no-classes">No classes yet.</p>'}
    `;

    // Slight delay then fade back in (feels smoother)
    setTimeout(() => {
      container.classList.remove("fade");
    }, 50); // tiny delay helps prevent flash
  }, 400); // match fade-out duration
}

// Simple emoji placeholders (replace later with real images)
function getRoomEmoji(room) {
  const logos = {
    Hamilton: "assets/BBB Dog.svg",
    Neville: "assets/Gemar logo.svg",
    Mortimer: "assets/Bestex B-solo.svg",
    Beaufort: "assets/Sempertex windmill.svg",
  };

  const src = logos[room];
  if (!src) return "🎈"; // fallback

  return `<img src="${src}" alt="${room} logo" class="room-logo">`;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  const hash = location.hash.slice(1) || "home";
  router(hash);

  if (hash === "schedule") {
    const tab =
      document.querySelector(".day-tab.active") ||
      document.querySelector('.day-tab[data-day="friday"]');
    if (tab) renderDay(tab.dataset.day);
  }

  // FAQ accordion – independent toggles
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const clickedItem = header.parentElement;
      const container =
        clickedItem.closest(".accordion-content") || clickedItem.parentElement;

      // Close other items only at the same level
      container
        .querySelectorAll(":scope > .accordion-item")
        .forEach((sibling) => {
          if (sibling !== clickedItem) {
            sibling.classList.remove("active");
          }
        });

      // Toggle clicked one
      clickedItem.classList.toggle("active");
    });
  });

  // Full timetable – times in local time (assume same timezone as users)
  const timetable = [
    {
      date: "2026-02-15",
      timeStart: "21:25",
      timeEnd: "21:27",
      name: "Test Event",
    },
    // Friday Feb 27
    {
      date: "2026-02-27",
      timeStart: "08:00",
      timeEnd: "09:00",
      name: "Beginner Class",
    },
    {
      date: "2026-02-27",
      timeStart: "09:00",
      timeEnd: "09:45",
      name: "Event Registration",
    },
    {
      date: "2026-02-27",
      timeStart: "09:45",
      timeEnd: "11:00",
      name: "Welcome / Ice Breaker",
    },
    {
      date: "2026-02-27",
      timeStart: "11:00",
      timeEnd: "23:59",
      name: "Jam Area Open",
    }, // open late
    {
      date: "2026-02-27",
      timeStart: "11:00",
      timeEnd: "12:30",
      name: "Classes",
    },
    {
      date: "2026-02-27",
      timeStart: "12:30",
      timeEnd: "14:00",
      name: "Lunch Buffet",
    },
    {
      date: "2026-02-27",
      timeStart: "14:00",
      timeEnd: "15:30",
      name: "Classes",
    },
    { date: "2026-02-27", timeStart: "15:30", timeEnd: "16:00", name: "Break" },
    {
      date: "2026-02-27",
      timeStart: "16:00",
      timeEnd: "17:30",
      name: "Classes",
    },
    {
      date: "2026-02-27",
      timeStart: "19:30",
      timeEnd: "22:00",
      name: "Competition Time",
    },

    // Saturday Feb 28
    {
      date: "2026-02-28",
      timeStart: "09:00",
      timeEnd: "23:59",
      name: "Jam Area Open",
    },
    {
      date: "2026-02-28",
      timeStart: "10:30",
      timeEnd: "12:00",
      name: "Classes",
    },
    {
      date: "2026-02-28",
      timeStart: "12:00",
      timeEnd: "12:30",
      name: "Group Photo",
    },
    {
      date: "2026-02-28",
      timeStart: "12:30",
      timeEnd: "14:00",
      name: "Lunch Buffet",
    },
    {
      date: "2026-02-28",
      timeStart: "14:00",
      timeEnd: "15:30",
      name: "Classes",
    },
    { date: "2026-02-28", timeStart: "15:30", timeEnd: "16:00", name: "Break" },
    {
      date: "2026-02-28",
      timeStart: "16:00",
      timeEnd: "17:30",
      name: "Classes",
    },
    {
      date: "2026-02-28",
      timeStart: "19:30",
      timeEnd: "22:00",
      name: "Evening Entertainment & Awards",
    },

    // Sunday March 1
    {
      date: "2026-03-01",
      timeStart: "09:00",
      timeEnd: "15:00",
      name: "Jam Area Open",
    },
    {
      date: "2026-03-01",
      timeStart: "10:30",
      timeEnd: "12:00",
      name: "Classes",
    },
    {
      date: "2026-03-01",
      timeStart: "12:00",
      timeEnd: "13:30",
      name: "Lunch Buffet",
    },
    {
      date: "2026-03-01",
      timeStart: "13:30",
      timeEnd: "15:00",
      name: "Classes",
    },
    {
      date: "2026-03-01",
      timeStart: "15:15",
      timeEnd: "15:45",
      name: "Closing Ceremony",
    },
    {
      date: "2026-03-01",
      timeStart: "19:30",
      timeEnd: "22:00",
      name: "Post Bash Meal",
    },
  ];

  timetable.sort(
    (a, b) =>
      parseEventTime(a.date, a.timeStart) - parseEventTime(b.date, b.timeStart),
  );

  // Helper to parse "HH:MM" on given date
  function parseEventTime(dateStr, timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(dateStr);
    d.setHours(h, m, 0, 0);
    return d;
  }

  // Find next event + format remaining time
  function getNextEvent() {
    const now = new Date();
    let next = null;
    let minDiff = Infinity;
    let ongoing = null;

    timetable.forEach((ev) => {
      const start = parseEventTime(ev.date, ev.timeStart);
      const end = parseEventTime(ev.date, ev.timeEnd);

      if (now >= start && now < end) {
        ongoing = ev;
      }

      const diff = start - now;
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        next = { ...ev, start };
      }
    });

    if (ongoing) {
      return { name: ongoing.name, timeLeft: "Happening now! 🎈" };
    }

    if (!next) {
      return { name: "Event finished!", timeLeft: "" };
    }

    const diffMs = next.start - now;

    if (diffMs < 5 * 60 * 1000) {
      return { name: next.name, timeLeft: "Starting soon! 🎈" };
    }

    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    let timeLeft = "";

    if (days > 0) {
      timeLeft += `${days} day${days === 1 ? "" : "s"} `;
    }

    if (hours > 0 || days === 0) {
      if (timeLeft) timeLeft += " ";
      timeLeft += `${hours.toString().padStart(2, "0")}h `;
    }

    if (minutes > 0 || (hours === 0 && days === 0)) {
      if (timeLeft) timeLeft += " ";
      timeLeft += `${minutes.toString().padStart(2, "0")}m`;
    }

    // Friendly long-term message
    if (days >= 7) {
      return {
        name: next.name,
        timeLeft: `${days} days until ${next.name} 🎈`,
      };
    }

    return {
      name: next.name,
      timeLeft: timeLeft.trim() || "Soon!",
    };
  }

  // Update display
  function updateNextEvent() {
    const { name, timeLeft } = getNextEvent();
    document.getElementById("countdown").innerHTML =
      `<strong>${name}</strong><br>${timeLeft}`;
  }

  setInterval(updateNextEvent, 1000);
  updateNextEvent(); // initial call

  // Tabs
  document.querySelectorAll(".day-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".day-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderDay(tab.dataset.day);
    });
  });

  // Schedule view toggle
  window.showView = (view) => {
    document.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.textContent.includes(view === "event" ? "Full" : "Class"),
      );
    });

    const eventView = document.getElementById("event-view");
    const classesView = document.getElementById("classes-view");

    if (view === "event") {
      eventView.classList.add("active");
      classesView.classList.remove("active");
    } else {
      eventView.classList.remove("active");
      classesView.classList.add("active");
    }
  };

  // Dark mode toggle
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const root = document.documentElement;

  function setTheme(isDark) {
    if (isDark) {
      root.classList.add("dark");
      themeIcon.textContent = "light_mode";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      themeIcon.textContent = "dark_mode";
      localStorage.setItem("theme", "light");
    }
  }

  // Load saved preference or system default
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    setTheme(true);
  } else {
    setTheme(false);
  }

  // Click handler
  toggleBtn.addEventListener("click", () => {
    const isCurrentlyDark = root.classList.contains("dark"); // ← change here too
    setTheme(!isCurrentlyDark);
  });
});
