import axiosClient from './rumi_client';

const roomSharePostApi = {

    getAllPosts: async () => {
        try {
            const response = await axiosClient.get('/room-share-posts');
            return response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    },

    createPost: async (post) => {
        try {
            console.log("Creating post:", post);
            const response = await axiosClient.post('/room-share-posts', post);
            return response.data;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    },

    filterPosts: async (filters) => {
        try {
            const params = new URLSearchParams();
            if (filters.location) params.append("location", filters.location);
            if (filters.genderPreference) params.append("genderPreference", filters.genderPreference);
            if (filters.maxRent) params.append("maxRent", filters.maxRent);

            const response = await axiosClient.get(`/room-share-posts/filter?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Error filtering posts:", error);
            throw error;
        }
    }
};

export default roomSharePostApi;