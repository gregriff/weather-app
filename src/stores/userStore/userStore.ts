import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { CurrentLocation, Gridpoints, User } from '@/stores/userStore/types.ts';
import { requestUserLocation } from '@/services/locationService.ts';

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User | undefined>(undefined);
    const currentLocation = ref<CurrentLocation | undefined>(undefined);

    // TODO: we will need to ensure this is always up to date, and if its not, setting it to undefined
    // maybe check if currentLocation has changed
    const currentGridpoints = ref<Gridpoints | undefined>(undefined);

    function $reset() {
        user.value = undefined;
        currentLocation.value = undefined;
        currentGridpoints.value = undefined;
    }

    // actions
    // TODO: getCurrentUser: hits authStatus, creates store.user

    async function getCurrentLocation() {
        currentLocation.value = await requestUserLocation();
    }

    return { user, currentLocation, currentGridpoints, getCurrentLocation, $reset };
});
