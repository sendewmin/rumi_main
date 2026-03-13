package com.rumi.rumi_backend_v2.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SupabaseStorageService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String serviceKey;

    @Value("${SUPABASE_BUCKET}")
    private String bucket;


    public String upload(MultipartFile file, String path) {

        try{
            String uploadUrl=supabaseUrl + "/storage/v1/object/" + bucket+ "/" + path;
            HttpURLConnection connection = getHttpURLConnection(file, uploadUrl);
            OutputStream os = connection.getOutputStream(); // Here we get the connection outputStream
            os.write(file.getBytes());  //here we get the file and get the bytes and write it to the connection outputStream

        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }



    }

    private HttpURLConnection getHttpURLConnection(MultipartFile file, String uploadUrl) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) new URL(uploadUrl).openConnection();  // This opens the connection for the supabase
        connection.setRequestMethod("POST");  // here we say the connection as POST
        connection.setDoOutput(true);  // This allows the data to be sent in the body
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey); //Here we pass the service key to Supabase connection so it can verify
        connection.setRequestProperty("Content-Type", file.getContentType());  // Here we say what file type it is .
        return connection;
    }

}
