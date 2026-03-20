package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.model.PaymentCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentConditionRepo extends JpaRepository<PaymentCondition, Long> {
    List<PaymentCondition> findByConditionIdIn(List<Long> ids);
}
