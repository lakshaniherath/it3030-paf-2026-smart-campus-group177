package com.sliit.paf.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        // ඔයාගේ Database එකේ නම මෙතන දෙන්න
        return "smart_campus";
    }

    @Override
    public MongoClient mongoClient() {
        // ඔයාගේ MongoDB URI එක මෙතන කෙලින්ම String එකක් විදිහට දෙන්න
        // එතකොට properties file එකේ encoding ප්‍රශ්න එන්නේ නැහැ
        ConnectionString connectionString = new ConnectionString("mongodb+srv://paf_admin:Sliit%40123@cluster0.cf9wlji.mongodb.net/smart_campus?retryWrites=true&w=majority");
        
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .build();
        
        return MongoClients.create(mongoClientSettings);
    }
}
