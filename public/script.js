


// Get HTML elements
const mealForm = document.getElementById('mealForm');
const mealList = document.getElementById('mealList');

const mealId = document.getElementById('mealId');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('meal_date');
const descriptionInput = document.getElementById('description');

const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');




async function loadMeals() {
    try {
        const response = await fetch('/api/meals');

        if (!response.ok) {
            throw new Error('Failed to load meals');
        }

        const meals = await response.json();

        mealList.innerHTML = '';

        if (meals.length === 0) {
            mealList.innerHTML = `
                <tr>
                    <td colspan="5">No meals added yet.</td>
                </tr>
            `;
        }

        meals.forEach(meal => {
            const row = document.createElement('tr');

            const values = [
                meal.name,
                meal.category,
                meal.meal_date,
                meal.description || ''
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            // Action buttons
            const actions = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn';
            editButton.addEventListener('click', () => editMeal(meal));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteMeal(meal.id));

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            row.appendChild(actions);
            mealList.appendChild(row);
        });

        updateDashboard(meals);

    } catch (error) {
        console.error('Loading error:', error);

        mealList.innerHTML = `
            <tr>
                <td colspan="5">Unable to load meals. Check your server.</td>
            </tr>
        `;
    }
}



function updateDashboard(meals) {

    document.getElementById('totalMeals').textContent =
        meals.length;

    document.getElementById('breakfastCount').textContent =
        meals.filter(m => m.category === 'Breakfast').length;

    document.getElementById('lunchCount').textContent =
        meals.filter(m => m.category === 'Lunch').length;

    document.getElementById('dinnerCount').textContent =
        meals.filter(m => m.category === 'Dinner').length;
}




mealForm.addEventListener('submit', async function(event) {

    event.preventDefault();

    const meal = {
        name: nameInput.value.trim(),
        category: categoryInput.value,
        meal_date: dateInput.value,
        description: descriptionInput.value.trim()
    };

    if (!meal.name || !meal.category || !meal.meal_date) {
        alert('Please complete all required fields.');
        return;
    }

    const id = mealId.value;

    // Correct API URLs
    const url = id
        ? `/api/meals/${id}`
        : '/api/meals';

    const method = id ? 'PUT' : 'POST';

    try {

        submitBtn.disabled = true;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meal)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to save meal');
        }

        alert(
            id
                ? 'Meal updated successfully!'
                : 'Meal added successfully!'
        );

        mealForm.reset();
        mealId.value = '';

        submitBtn.textContent = 'Add Meal';
        document.getElementById('formTitle').textContent = 'Add New Meal';
        cancelBtn.hidden = true;

        await loadMeals();

    } catch (error) {

        console.error('Saving error:', error);
        alert(error.message);

    } finally {
        submitBtn.disabled = false;
    }
});




function editMeal(meal) {

    mealId.value = meal.id;

    nameInput.value = meal.name;
    categoryInput.value = meal.category;
    dateInput.value = meal.meal_date;
    descriptionInput.value = meal.description || '';

    submitBtn.textContent = 'Update Meal';

    document.getElementById('formTitle').textContent =
        'Edit Meal';

    cancelBtn.hidden = false;

    document.querySelector('.form-section').scrollIntoView({
        behavior: 'smooth'
    });
}




cancelBtn.addEventListener('click', function() {

    mealForm.reset();

    mealId.value = '';

    submitBtn.textContent = 'Add Meal';

    document.getElementById('formTitle').textContent =
        'Add New Meal';

    cancelBtn.hidden = true;
});




async function deleteMeal(id) {

    const confirmDelete = confirm(
        'Are you sure you want to delete this meal?'
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(`/api/meals/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to delete meal');
        }

        alert('Meal deleted successfully!');

        await loadMeals();

    } catch (error) {

        console.error('Delete error:', error);
        alert(error.message);
    }
}




loadMeals();
