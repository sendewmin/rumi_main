package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="rule")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="rule_id")
    @Getter
    private Long ruleId;

    @Getter
    @Setter
    @Column(name="rule_name")
    private String ruleName;

}
