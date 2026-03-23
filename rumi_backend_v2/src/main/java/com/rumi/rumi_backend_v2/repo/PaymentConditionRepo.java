package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.PaymentCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentConditionRepo extends JpaRepository<PaymentCondition, Long> {
    List<PaymentCondition> findByConditionIdIn(List<Long> ids);
}
