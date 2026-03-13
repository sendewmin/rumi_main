import axiosClient from  "./rumi_client"

const imageApi = {

    uploadImage: (images, room_id) => {
        const formData = new FormData();
        
        // files.forEach((file) => {
        //     formData.append("image", file);
        // });

        Array.from(images).forEach((image) => {
            formData.append("image", image);
        });

        return axiosClient.post(`/rooms/${room_id}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
    ,
    getImage: (room_id) => {
        return axiosClient.get(`/rooms/${room_id}/images`, {
            responseType: "blob"
        });
    }


}

export default imageApi