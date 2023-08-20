package util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ObjectMapperSupport {

    private static ObjectMapper mapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(ObjectMapperSupport.class);

    public static String objectToJson(Object data) {
        String result = "";
        try {
            result = mapper.writeValueAsString(data);
        } catch (Throwable t) {
            logger.error("[ObjectMapperSupport-objectToJson] Throwable");
        }
        return result;
    }

    public static Map<String, Object> jsonToMap(String json) {
        Map<String, Object> map = null;

        try {
            map = mapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (Throwable t) {
            logger.error("[ObjectMapperSupport-jsonToMap] Throwable");
        }
        return map != null ? map : new HashMap<String, Object>();
    }

    public static List<Map<String, Object>> jsonToList(String json) {
        ArrayList<Map<String, Object>> list = null;

        try {
            list = mapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {
            });
        } catch (Throwable t) {
            logger.error("[ObjectMapperSupport-jsonToList] Throwable");
        }
        return list != null ? list : new ArrayList<Map<String, Object>>();
    }

}
