<script setup lang="ts">
const searchBoxPlaceholder = 'Find City...';

function toggleSearchBoxPlaceholder(e: FocusEvent) {
    const input = e.target as HTMLInputElement;
    input.placeholder = input.placeholder ? '' : searchBoxPlaceholder;
}

// TODO:
// - have search fuzzy match to some list of cities, maybe loaded with an API onmount of app.
// - have close matches preload NWS geopoints info to prepare for weather API calls
// - have couple closest match fetch weather data, after a reasonable onkeyup timeout
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col-6 text-center">
            <input
                @focus="toggleSearchBoxPlaceholder"
                @blur="toggleSearchBoxPlaceholder"
                class="form-control text-center"
                list="citySearchOptions"
                :placeholder="searchBoxPlaceholder"
            />
            <datalist id="citySearchOptions">
                <option value="San Francisco"></option>
                <option value="New York"></option>
                <option value="Seattle"></option>
                <option value="Los Angeles"></option>
                <option value="Chicago"></option>
            </datalist>
        </div>
    </div>
</template>
