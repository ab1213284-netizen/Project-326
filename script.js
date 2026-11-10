const weeklyMenu = {
    Monday: {
        Breakfast: ["Poha", "Bread and Butter", "Milk / Tea"],
        Lunch: ["Rice", "Dal Tadka", "Chapati", "Seasonal Sabzi", "Salad"],
        Dinner: ["Chapati", "Mixed Vegetables", "Rice", "Curd"]
    },
    Tuesday: {
        Breakfast: ["Aloo Paratha", "Curd", "Tea"],
        Lunch: ["Rajma", "Rice", "Chapati", "Salad"],
        Dinner: ["Chapati", "Dal", "Aloo Gobi", "Rice"]
    },
    Wednesday: {
        Breakfast: ["Idli", "Sambar", "Chutney"],
        Lunch: ["Chole", "Rice", "Roti", "Salad"],
        Dinner: ["Veg Fried Rice", "Manchurian", "Soup"]
    },
    Thursday: {
        Breakfast: ["Veg Sandwich", "Banana", "Milk"],
        Lunch: ["Dal", "Rice", "Aloo Gobi", "Chapati"],
        Dinner: ["Paneer Curry", "Chapati", "Jeera Rice", "Salad"]
    },
    Friday: {
        Breakfast: ["Puri", "Aloo Sabzi", "Tea"],
        Lunch: ["Kadhi Pakora", "Rice", "Chapati", "Salad"],
        Dinner: ["Veg Pulao", "Raita", "Chapati", "Dal"]
    },
    Saturday: {
        Breakfast: ["Dosa", "Sambar", "Chutney"],
        Lunch: ["Chole Bhature", "Pickle", "Buttermilk"],
        Dinner: ["Chapati", "Dal Makhani", "Seasonal Sabzi", "Rice"]
    },
    Sunday: {
        Breakfast: ["Aloo Paratha", "Curd", "Tea"],
        Lunch: ["Special Thali", "Paneer Curry", "Rice", "Salad"],
        Dinner: ["Veg Biryani", "Raita", "Salad", "Gulab Jamun"]
    }
};

const mealTimings = {
    Breakfast: "7:30 AM – 9:00 AM",
    Lunch: "12:00 PM – 2:00 PM",
    Dinner: "7:00 PM – 9:00 PM"
};

const specialMeals = {
    Tuesday: { Lunch: "Rajma Special" },
    Wednesday: { Dinner: "Chinese Dinner" },
    Thursday: { Dinner: "Paneer Special" },
    Saturday: { Breakfast: "South Indian Breakfast", Lunch: "Weekend Special" },
    Sunday: { Breakfast: "Sunday Breakfast", Lunch: "Sunday Special Thali", Dinner: "Biryani Night 🎉" }
};

const STORAGE_KEY = "hostelMessFeedback";

function showMenu() {
    const day = document.getElementById("day").value;
    const container = document.getElementById("menu-container");

    container.innerHTML = "";

    ["Breakfast", "Lunch", "Dinner"].forEach(meal => {
        const card = document.createElement("div");
        card.className = "menu-card";

        const heading = document.createElement("h3");
        heading.textContent = meal;
        card.appendChild(heading);

        const timing = document.createElement("p");
        timing.textContent = "⏰ " + mealTimings[meal];
        card.appendChild(timing);

        const list = document.createElement("ul");

        weeklyMenu[day][meal].forEach(food => {
            const item = document.createElement("li");
            item.textContent = food;
            list.appendChild(item);
        });

        card.appendChild(list);

        if (specialMeals[day] && specialMeals[day][meal]) {
            const special = document.createElement("p");
            special.className = "special";
            special.textContent = "⭐ Special: " + specialMeals[day][meal];
            card.appendChild(special);
        }

        container.appendChild(card);
    });

    const dinner = weeklyMenu[day].Dinner;
    document.getElementById("special").textContent =
        specialMeals[day]?.Dinner
            ? specialMeals[day].Dinner + " — " + dinner.join(", ")
            : "No special dinner scheduled. Menu: " + dinner.join(", ");
}

function getFeedback() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function submitFeedback(event) {
    event.preventDefault();

    const comment = document.getElementById("comments").value.trim();

    if (!comment) {
        document.getElementById("message").textContent =
            "Please enter your feedback before submitting.";
        return;
    }

    const feedback = getFeedback();

    const entry = {
        name: document.getElementById("student").value.trim() || "Anonymous",
        day: document.getElementById("feedbackDay").value,
        meal: document.getElementById("meal").value,
        rating: Number(document.getElementById("rating").value),
        improvement: document.getElementById("improvement").value,
        preferredTime: document.getElementById("preferredTime").value.trim(),
        comments: comment
    };

    feedback.push(entry);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
        document.getElementById("message").textContent =
            "Thank you! Your feedback has been saved.";
        document.getElementById("feedbackForm").reset();
        renderFeedback();
    } catch {
        document.getElementById("message").textContent =
            "Unable to save feedback. Please check your browser storage.";
    }
}

function renderFeedback() {
    const feedback = getFeedback();
    const average = document.getElementById("average");
    const responses = document.getElementById("responses");
    const list = document.getElementById("feedback-list");

    list.innerHTML = "";

    if (feedback.length === 0) {
        average.textContent = "No ratings yet";
        responses.textContent = "0 feedback responses";
        list.textContent = "No feedback has been submitted yet.";
        return;
    }

    const total = feedback.reduce((sum, item) => sum + Number(item.rating), 0);
    const avg = total / feedback.length;

    average.textContent = "⭐ " + avg.toFixed(1) + " / 5";
    responses.textContent =
        feedback.length + " feedback response" +
        (feedback.length === 1 ? "" : "s");

    feedback.slice(-5).reverse().forEach(item => {
        const entry = document.createElement("div");
        entry.className = "feedback-entry";

        const title = document.createElement("strong");
        title.textContent =
            `${item.meal} — ${item.day} | Rating: ${item.rating}/5`;

        const comment = document.createElement("p");
        comment.textContent = item.comments;

        const name = document.createElement("p");
        name.textContent = "Student: " + item.name;

        const suggestion = document.createElement("p");
        suggestion.textContent = "Suggested improvement: " + item.improvement;

        entry.append(title, comment, name, suggestion);

        if (item.preferredTime) {
            const time = document.createElement("p");
            time.textContent = "Preferred timing: " + item.preferredTime;
            entry.appendChild(time);
        }

        list.appendChild(entry);
    });
}

function clearFeedback() {
    if (confirm("Are you sure you want to delete all demo feedback?")) {
        localStorage.removeItem(STORAGE_KEY);
        document.getElementById("message").textContent =
            "Demo feedback has been cleared.";
        renderFeedback();
    }
}

document.getElementById("feedbackForm")
    .addEventListener("submit", submitFeedback);

showMenu();
renderFeedback();