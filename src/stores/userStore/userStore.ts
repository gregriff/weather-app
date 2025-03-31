import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { CurrentLocation, User } from '@/stores/userStore/types.ts';
import { requestUserLocation } from '@/services/locationService.ts';

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User | undefined>(undefined);
    const currentLocation = ref<CurrentLocation | null>(null);

    function $reset() {
        user.value = undefined;
    }

    // actions
    // TODO: getCurrentUser: hits authStatus, creates store.user

    async function getCurrentLocation() {
        currentLocation.value = await requestUserLocation();
    }

    return { user, currentLocation, getCurrentLocation, $reset };
});
