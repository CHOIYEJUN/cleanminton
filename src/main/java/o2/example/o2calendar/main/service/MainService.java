package o2.example.o2calendar.main.service;


import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service("mainService")
public class MainService {

	@Autowired
	@Resource(name="sqlSession")
	private SqlSessionTemplate sqlSession;

	public List<Map<String, Object>> getBemingData(Map<String, Object> param) {
		return sqlSession.selectList("book.getBookingData", param);
	}

	public List<Map<String, Object>> getBookingMemberList(Map<String, Object> param) {
		return sqlSession.selectList("book.getBookingMemberList", param);
	}

	public List<Map<String, Object>> insertBookingData(Map<String, Object> param) {
		return sqlSession.selectList("book.insertBookingData", param);
	}

	public void updateBookCount(Map<String, Object> param) {
		sqlSession.update("book.updateBookCount", param);
	}

	public void updatePayData(Map<String, Object> param) {
		sqlSession.update("book.updatePayData", param);
	}

	public void deleteData(Map<String, Object> param) {
		sqlSession.delete("book.deleteData", param);
	}
	public void minusBookCount(Map<String, Object> param) {
		sqlSession.update("book.minusBookCount", param);
	}


}
